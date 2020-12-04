<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Http\Client;
use Core\Ad\adLDAPFactory;
use Zend\Json\Json;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;

class FiiController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }
    
    public function listarEmpresasAction()
    {
        $data = array();
        
        try {

            $pNode = $this->params()->fromQuery('node',null);

            $sql = "select e.apelido emp, e.id_empresa
                        from ms.empresa e
                    where e.id_empresa not in (26, 11, 28, 27, 20)
                    order by e.apelido";
            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);

            $objReturn = $this->getCallbackModel();
            
        } catch (\Exception $e) {
            $objReturn = $this->setCallbackError($e->getMessage());
        }
        
        return $objReturn;
    }

    public function listarfichaitemheaderAction()
    {
        $data = array();
        
        try {
            $data = $this->params()->fromPost('data',null);
            $em = $this->getEntityManager();

            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            $sql = "select to_char(add_months(trunc($sysdate,'MM'),-11),'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-10),'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-9), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-8), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-7), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-6), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-5), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-4), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-3), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-2), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-1), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-0), 'MM') as id from dual
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function estoquemes($idEmpresas,$idMarcas,$codProdutos,$data,$idCurvas,$idOmvUsers)
    {
        $data1 = array();

        $andSql = '';
        $andSql2 = '';
        if($idEmpresas){
            $andSql  = " and e.id_empresa in ($idEmpresas)";
            $andSql2 = " and vi.id_empresa in ($idEmpresas)";
        }
        if($idMarcas){
            $andSql .= " and ic.id_marca in ($idMarcas)";
            $andSql2 .= $andSql;
        }
        if($codProdutos){
            $andSql .= " and e.cod_item in ('$codProdutos')";
            $andSql2 .= " and i.cod_item in ('$codProdutos')";
        }

        if($data){
            $andSql .= " and trunc(e.data, 'MM') >= add_months(trunc(to_date('01/".$data."'),'MM'),-11)";
            $andSql .= " and trunc(e.data, 'MM') <= add_months(trunc(to_date('01/".$data."'),'MM'),0)";
            $andSql2 .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc(to_date('01/".$data."'),'MM'),-12)";
            $andSql2 .= " and trunc(vi.data_emissao, 'MM') <= add_months(trunc(to_date('01/".$data."'),'MM'),0)";
        }else{
            $andSql .= " and trunc(e.data, 'MM') >= add_months(trunc(sysdate,'MM'),-11)";
            $andSql2 .= " and vi.data_emissao >= add_months(trunc(sysdate, 'MM'),-12)";
        }
        if($idCurvas){
            $andSql .= " and e.curva_nbs in ('$idCurvas')";
            $andSql2 .= " and e.curva_abc in ('$idCurvas')";
        }
        
        if($idOmvUsers){
            $andSql .= " and (e.id_empresa, e.id_item, e.id_categoria) in (
                select id_empresa, id_item, id_categoria
                  from js.omv_analise_log a 
                 where a.data_aprovacao >= add_months(sysdate, -12) -- Filtro de data também
                   and usuario_aprovacao in ('$idOmvUsers') -- Usuários selecioados
              )
              ";
            $andSql2 .= $andSql;
        }

        try {
            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql = " select a.data, a.estoque_inicial, a.estoque_final,
       
                            (case when b.cmv > 0 then round((a.estoque_final/b.cmv)*30,2) end) as estoque_dias, -- Dias de Estoque
                            (case when b.cmv > 0 then round(a.estoque_inicial/b.rol,2) end) as estoque_indice_rol, -- Índice Estoque/ROL
                            (case when b.cmv > 0 then round(a.estoque_inicial/b.lb,2) end) as estoque_indice_lb -- Índice Estoque/LB
                            
                    from (select e.data,
                                    sum(e.esi_valor) as estoque_inicial, 
                                    sum(e.esf_valor) as estoque_final
                            from vm_ge_estoque_master e, ms.tb_item_categoria ic
                            where e.id_item = ic.id_item
                                and e.id_categoria = ic.id_categoria
                                $andSql
                            group by e.data) a,
                            
                            -- Venda mês anterior referência
                            (select data, rol, lb, cmv
                            from (select trunc(vi.data_emissao, 'MM') as data,
                                            sum(vi.rol) as rol,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                            sum(vi.custo) as cmv
                                    from pricing.vm_ie_ve_venda_item vi, ms.tb_item_categoria ic,
                                            ms.tb_item i, ms.tb_categoria c, ms.tb_estoque e
                                    where vi.id_item = ic.id_item
                                        and vi.id_categoria = ic.id_categoria
                                        and vi.id_item = i.id_item
                                        and vi.id_categoria = c.id_categoria
                                        and vi.id_empresa = e.id_empresa
                                        and vi.id_item = e.id_item
                                        and vi.id_categoria = e.id_categoria
                                        $andSql2 
                                    
                                    group by trunc(vi.data_emissao, 'MM'))) b
                                    
                    where a.data = b.data(+)
                    order by a.data asc
                    ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();
            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('estoque_inicial', new ValueStrategy);
            $hydrator->addStrategy('estoque_final', new ValueStrategy);
            $hydrator->addStrategy('estoque_dias', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $arrayEstoqueMes    = array();
            $EstoqueMesInicial  = array();
            $EstoqueMesFinal    = array();
            $EstoqueDias        = array();

            foreach ($resultSet as $row) {

                $data1 = $hydrator->extract($row);
                $EstoqueMesInicial[]    = (float) $data1['estoqueInicial'];
                $EstoqueMesFinal[]      = (float) $data1['estoqueFinal'];
                $EstoqueDias[]          = (float) $data1['estoqueDias'];

            }
            // $this->setCallbackData($arrayEstoqueMes);
            
        } catch (\Exception $e) {
            $EstoqueMesInicial  = null;
            $EstoqueMesFinal    = null;
            $EstoqueDias        = null;
        }

        $arrayEstoqueMes[] = $EstoqueMesInicial;
        $arrayEstoqueMes[] = $EstoqueMesFinal;
        $arrayEstoqueMes[] = $EstoqueDias;

        return $arrayEstoqueMes;
    }

    public function listarfichaitemAction()
    {
        $data = array();
        
        try {

            $idEmpresas     = $this->params()->fromQuery('idEmpresas',null);
            $idMarcas       = $this->params()->fromQuery('idMarcas',null);
            $codProdutos    = $this->params()->fromQuery('codProdutos',null);
            $tpPessoas      = $this->params()->fromQuery('tpPessoas',null);
            $data           = $this->params()->fromQuery('data',null);
            $idCurvas       = $this->params()->fromQuery('idCurvas',null);
            $idOmvUsers     = $this->params()->fromQuery('idOmvUsers',null);
            $indicadoresAdd = $this->params()->fromQuery('indicadoresAdd',null);

            $indicadoresAdd = json_decode($indicadoresAdd);

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas = implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas = implode("','",json_decode($tpPessoas));
            }
            if($idCurvas){
                $idCurvas = implode("','",json_decode($idCurvas));
            }
            if($idOmvUsers){
                $idOmvUsers = implode("','",json_decode($idOmvUsers));
            }

            $andSql = '';
            if($idEmpresas){
                $andSql = " and vi.id_empresa in ($idEmpresas)";
            }

            if($idMarcas){
                $andSql .= " and m.id_marca in ($idMarcas)";
            }

            if($codProdutos){
                $andSql .= " and i.cod_item||c.descricao in ('$codProdutos')";
            }

            if($tpPessoas){
                $andSql .= " and p.tipo_pessoa in ('$tpPessoas')";
            }
            
            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            if($data){
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc($sysdate,'MM'),-11)";
                $andSql .= " and trunc(vi.data_emissao, 'MM') <= add_months(trunc($sysdate,'MM'),0)";
            }else{
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)";
            }
            if($idCurvas){
                $andSql .= " and t.id_curva_abc in ('$idCurvas')";
            }
            if($idOmvUsers){
                $andSql .= " and (vi.id_empresa, vi.id_item, vi.id_categoria) in (
                    select id_empresa, id_item, id_categoria
                      from js.omv_analise_log a 
                     where a.data_aprovacao >= add_months(sysdate, -12) -- Filtro de data também
                       and usuario_aprovacao in ('$idOmvUsers') -- Usuários selecioados
                  )
                  ";
            }

            $em = $this->getEntityManager();
            
            $meses = [null,
                     'Janeiro',
                     'Fevereiro',
                     'Março',
                     'Abril',
                     'Maio',
                     'Junho',
                     'Julho',
                     'Agosto',
                     'Setembro',
                     'Outubro',
                     'Novembro',
                     'Dezembro'];

            $conn = $em->getConnection();

            $sql = "select add_months(trunc($sysdate,'MM'),-11) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-10) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-9) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-8) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-7) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-6) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-5) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-4) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-3) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-2) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-1) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-0) as id from dual            
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data1 = array();
            $categories = array();

            $arrayDesc      = array();
            $arrayPreco     = array();
            $arrayImposto   = array();
            $arrayRolUni    = array();
            $arrayCusto     = array();
            $arrayLucro     = array();
            $arrayImpostoPc = array();
            $arrayDescPc    = array();
            $arrayRob       = array();
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();
            $arrayMb        = array();
            $arrayQtde      = array();
            $arrayNf        = array();
            $arrayCc        = array();
            $arrayTkmcc     = array();
            $arrayTkmnf     = array();
            $arrayLbcc      = array();
            $arrayLbnf      = array();
            $arrayRobdia    = array();
            $arrayRoldia    = array();
            $arrayCmvdia    = array();
            $arrayLbdia     = array();
            $arrayQtdedia   = array();
            $arrayNfdia     = array();
            $arrayCcdia     = array();            

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
                $arrayLucro[]       = 0;
                $arrayImpostoPc[]   = 0;
                $arrayDescPc[]      = 0;
                $arrayRob[]         = 0;
                $arrayRol[]         = 0;
                $arrayCmv[]         = 0;
                $arrayLb[]          = 0;
                $arrayMb[]          = 0;
                $arrayQtde[]        = 0;
                $arrayNf[]          = 0;
                $arrayCc[]          = 0;
                $arrayTkmcc[]       = 0;
                $arrayTkmnf[]       = 0;
                $arrayLbcc[]        = 0;
                $arrayLbnf[]        = 0;
                $arrayRobdia[]      = 0;
                $arrayRoldia[]      = 0;
                $arrayCmvdia[]      = 0;
                $arrayLbdia[]       = 0;
                $arrayQtdedia[]     = 0;
                $arrayNfdia[]       = 0;
                $arrayCcdia[]       = 0;

            }

            $consultaEstoque = false;
            $EstoqueMesInicial  = array();
            $EstoqueMesFinal    = array();
            $EstoqueDias        = array();

            if($indicadoresAdd){

                for ($i=0; $i < count($indicadoresAdd); $i++) { 
                    if($indicadoresAdd[$i]->value){
                        $consultaEstoque = true;
                    }
                }
            }

            if($consultaEstoque){

                $EstoqueMes = $this->estoquemes($idEmpresas,$idMarcas,$codProdutos,$data,$idCurvas,$idOmvUsers);
                $EstoqueMesInicial  = $EstoqueMes[0];
                $EstoqueMesFinal    = $EstoqueMes[1];
                $EstoqueDias        = $EstoqueMes[2];
            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.lucro_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rob,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc,
                            round((case when b.rol > 0 then b.rob/b.cc end),2) as tkm_cc,
                            round((case when b.rol > 0 then b.rob/b.nf end),2) as tkm_nf,
                            round((case when b.rol > 0 then b.lb/b.cc end),2) as lb_cc,
                            round((case when b.rol > 0 then b.lb/b.nf end),2) as lb_nf,
                            round((case when b.rob > 0 then b.rob/c.dias_uteis end),2) as rob_dia,
                            round((case when b.rol > 0 then b.rol/c.dias_uteis end),2) as rol_dia,
                            round((case when b.cmv > 0 then b.cmv/c.dias_uteis end),2) as cmv_dia,
                            round((case when b.lb > 0 then b.lb/c.dias_uteis end),2) as lb_dia,
                            round((case when b.qtde > 0 then b.qtde/c.dias_uteis end),2) as qtde_dia,
                            round((case when b.nf > 0 then b.nf/c.dias_uteis end),2) as nf_dia,
                            round((case when b.cc > 0 then b.cc/c.dias_uteis end),2) as cc_dia
                        from (select trunc(vi.data_emissao, 'MM') as data,
                                     round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                     round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
                                     round((case when sum(qtde) > 0 then sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(qtde) end),2) as lucro_uni,
                                     round((case when sum(qtde) > 0 then ((sum(vi.rob)-sum(vi.rol))/sum(rob))*100 end),2) as imposto_perc,
                                     round((case when sum(qtde) > 0 then (sum(vi.desconto)/sum(rob))*100 end),2) as desconto_perc,
                                     sum(vi.rob) as rob,
                                     sum(vi.rol) as rol,
                                     sum(vi.custo) as cmv,
                                     sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                     round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                     sum(vi.qtde) as qtde,
                                     count(distinct vi.numero_nf) as nf,
                                     count(distinct vi.id_pessoa) as cc
                                from pricing.vm_ie_ve_venda_item vi,
                                     ms.empresa e,
                                     ms.tb_item_categoria ic,
                                     ms.tb_item i,
                                     ms.tb_categoria c,
                                     ms.tb_marca m,
                                     ms.pessoa p,
                                     ms.tb_estoque t
                               where vi.id_empresa = e.id_empresa
                               and vi.id_item = ic.id_item
                               and vi.id_categoria = ic.id_categoria
                               and vi.id_item = i.id_item
                               and vi.id_categoria = c.id_categoria
                               and ic.id_marca = m.id_marca
                               and vi.id_pessoa = p.id_pessoa(+)
                               and vi.id_empresa = t.id_empresa
                               and vi.id_item = t.id_item
                               and vi.id_categoria = t.id_categoria
                               $andSql
                               group by trunc(vi.data_emissao, 'MM')) b,
                             (select MES AS DATA, DECODE(MES,'01/05/2019',DIAS_UTEIS+0.33,DIAS_UTEIS) AS DIAS_UTEIS
                                from PRICING.VW_DIAS_UTEIS
                              where EMP = 'REDE'
                              and mes >= add_months(trunc($sysdate,'MM'),-11) ) c
                     where b.data = c.data(+)
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('desconto_uni', new ValueStrategy);
            $hydrator->addStrategy('preco_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_uni', new ValueStrategy);
            $hydrator->addStrategy('rol_uni', new ValueStrategy);
            $hydrator->addStrategy('custo_uni', new ValueStrategy);
            $hydrator->addStrategy('lucro_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_perc', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rob', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('nf', new ValueStrategy);
            $hydrator->addStrategy('cc', new ValueStrategy);
            $hydrator->addStrategy('tkm_cc', new ValueStrategy);
            $hydrator->addStrategy('tkm_nf', new ValueStrategy);
            $hydrator->addStrategy('lb_cc', new ValueStrategy);
            $hydrator->addStrategy('lb_nf', new ValueStrategy);
            $hydrator->addStrategy('rob_dia', new ValueStrategy);
            $hydrator->addStrategy('rol_dia', new ValueStrategy);
            $hydrator->addStrategy('cmv_dia', new ValueStrategy);
            $hydrator->addStrategy('lb_dia', new ValueStrategy);
            $hydrator->addStrategy('qtde_dia', new ValueStrategy);
            $hydrator->addStrategy('nf_dia', new ValueStrategy);
            $hydrator->addStrategy('cc_dia', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            $cont = 0;

            foreach ($resultSet as $row) {

                $elementos = $hydrator->extract($row);

                if($categories[$cont] == $meses[(float)substr($elementos['data'], 3, 2)]){

                    $arrayDesc[$cont]        = (float)$elementos['descontoUni'];
                    $arrayPreco[$cont]       = (float)$elementos['precoUni'];
                    $arrayImposto[$cont]     = (float)$elementos['impostoUni'];
                    $arrayRolUni[$cont]      = (float)$elementos['rolUni'];
                    $arrayCusto[$cont]       = (float)$elementos['custoUni'];
                    $arrayLucro[$cont]       = (float)$elementos['lucroUni'];
                    $arrayImpostoPc[$cont]   = (float)$elementos['impostoPerc'];
                    $arrayDescPc[$cont]      = (float)$elementos['descontoPerc'];
                    $arrayRob[$cont]         = (float)$elementos['rob'];
                    $arrayRol[$cont]         = (float)$elementos['rol'];
                    $arrayCmv[$cont]         = (float)$elementos['cmv'];
                    $arrayLb[$cont]          = (float)$elementos['lb'];
                    $arrayMb[$cont]          = (float)$elementos['mb'];
                    $arrayQtde[$cont]        = (float)$elementos['qtde'];
                    $arrayNf[$cont]          = (float)$elementos['nf'];
                    $arrayCc[$cont]          = (float)$elementos['cc'];
                    $arrayTkmcc[$cont]       = (float)$elementos['tkmCc'];
                    $arrayTkmnf[$cont]       = (float)$elementos['tkmNf'];
                    $arrayLbcc[$cont]        = (float)$elementos['lbCc'];
                    $arrayLbnf[$cont]        = (float)$elementos['lbNf'];
                    $arrayRobdia[$cont]      = (float)$elementos['robDia'];
                    $arrayRoldia[$cont]      = (float)$elementos['rolDia'];
                    $arrayCmvdia[$cont]      = (float)$elementos['cmvDia'];
                    $arrayLbdia[$cont]       = (float)$elementos['lbDia'];
                    $arrayQtdedia[$cont]     = (float)$elementos['qtdeDia'];
                    $arrayNfdia[$cont]       = (float)$elementos['nfDia'];
                    $arrayCcdia[$cont]       = (float)$elementos['ccDia'];
                }

                $cont++;
            }

            $data = array();

            $data[] = ['indicador'=>'Desconto Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayDesc[0],
                        'valorM10'=> $arrayDesc[1],
                        'valorM9'=> $arrayDesc[2],
                        'valorM8'=> $arrayDesc[3],
                        'valorM7'=> $arrayDesc[4],
                        'valorM6'=> $arrayDesc[5],
                        'valorM5'=> $arrayDesc[6],
                        'valorM4'=> $arrayDesc[7],
                        'valorM3'=> $arrayDesc[8],
                        'valorM2'=> $arrayDesc[9],
                        'valorM1'=> $arrayDesc[10],
                        'valorM0'=> $arrayDesc[11]
            ];
            
            $data[] = ['indicador'=>'% Desconto',
                       'vDecimos'=> 2,
                       'valorM11'=> $arrayDescPc[0],
                       'valorM10'=> $arrayDescPc[1],
                       'valorM9'=> $arrayDescPc[2],
                       'valorM8'=> $arrayDescPc[3],
                       'valorM7'=> $arrayDescPc[4],
                       'valorM6'=> $arrayDescPc[5],
                       'valorM5'=> $arrayDescPc[6],
                       'valorM4'=> $arrayDescPc[7],
                       'valorM3'=> $arrayDescPc[8],
                       'valorM2'=> $arrayDescPc[9],
                       'valorM1'=> $arrayDescPc[10],
                       'valorM0'=> $arrayDescPc[11]
            ];

            $data[] = [ 'indicador'=>'Preço Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayPreco[0],
                        'valorM10'=> $arrayPreco[1],
                        'valorM9'=> $arrayPreco[2],
                        'valorM8'=> $arrayPreco[3],
                        'valorM7'=> $arrayPreco[4],
                        'valorM6'=> $arrayPreco[5],
                        'valorM5'=> $arrayPreco[6],
                        'valorM4'=> $arrayPreco[7],
                        'valorM3'=> $arrayPreco[8],
                        'valorM2'=> $arrayPreco[9],
                        'valorM1'=> $arrayPreco[10],
                        'valorM0'=> $arrayPreco[11]
            ];

            $data[] = ['indicador'=>'Imposto Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayImposto[0],
                        'valorM10'=> $arrayImposto[1],
                        'valorM9'=> $arrayImposto[2],
                        'valorM8'=> $arrayImposto[3],
                        'valorM7'=> $arrayImposto[4],
                        'valorM6'=> $arrayImposto[5],
                        'valorM5'=> $arrayImposto[6],
                        'valorM4'=> $arrayImposto[7],
                        'valorM3'=> $arrayImposto[8],
                        'valorM2'=> $arrayImposto[9],
                        'valorM1'=> $arrayImposto[10],
                        'valorM0'=> $arrayImposto[11]
            ];

            $data[] = ['indicador'=>'% Imposto',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayImpostoPc[0],
                        'valorM10'=> $arrayImpostoPc[1],
                        'valorM9'=> $arrayImpostoPc[2],
                        'valorM8'=> $arrayImpostoPc[3],
                        'valorM7'=> $arrayImpostoPc[4],
                        'valorM6'=> $arrayImpostoPc[5],
                        'valorM5'=> $arrayImpostoPc[6],
                        'valorM4'=> $arrayImpostoPc[7],
                        'valorM3'=> $arrayImpostoPc[8],
                        'valorM2'=> $arrayImpostoPc[9],
                        'valorM1'=> $arrayImpostoPc[10],
                        'valorM0'=> $arrayImpostoPc[11]
            ];

            $data[] = ['indicador'=>'ROL Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayRolUni[0],
                        'valorM10'=> $arrayRolUni[1],
                        'valorM9'=> $arrayRolUni[2],
                        'valorM8'=> $arrayRolUni[3],
                        'valorM7'=> $arrayRolUni[4],
                        'valorM6'=> $arrayRolUni[5],
                        'valorM5'=> $arrayRolUni[6],
                        'valorM4'=> $arrayRolUni[7],
                        'valorM3'=> $arrayRolUni[8],
                        'valorM2'=> $arrayRolUni[9],
                        'valorM1'=> $arrayRolUni[10],
                        'valorM0'=> $arrayRolUni[11]
            ];
            
            $data[] = ['indicador'=>'Custo Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayCusto[0],
                        'valorM10'=> $arrayCusto[1],
                        'valorM9'=> $arrayCusto[2],
                        'valorM8'=> $arrayCusto[3],
                        'valorM7'=> $arrayCusto[4],
                        'valorM6'=> $arrayCusto[5],
                        'valorM5'=> $arrayCusto[6],
                        'valorM4'=> $arrayCusto[7],
                        'valorM3'=> $arrayCusto[8],
                        'valorM2'=> $arrayCusto[9],
                        'valorM1'=> $arrayCusto[10],
                        'valorM0'=> $arrayCusto[11]
            ];

            $data[] = ['indicador'=>'Lucro Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayLucro[0],
                        'valorM10'=> $arrayLucro[1],
                        'valorM9'=> $arrayLucro[2],
                        'valorM8'=> $arrayLucro[3],
                        'valorM7'=> $arrayLucro[4],
                        'valorM6'=> $arrayLucro[5],
                        'valorM5'=> $arrayLucro[6],
                        'valorM4'=> $arrayLucro[7],
                        'valorM3'=> $arrayLucro[8],
                        'valorM2'=> $arrayLucro[9],
                        'valorM1'=> $arrayLucro[10],
                        'valorM0'=> $arrayLucro[11]
            ];

            $data[] = ['indicador'=>'ROB',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRob[0],
                        'valorM10'=> $arrayRob[1],
                        'valorM9'=> $arrayRob[2],
                        'valorM8'=> $arrayRob[3],
                        'valorM7'=> $arrayRob[4],
                        'valorM6'=> $arrayRob[5],
                        'valorM5'=> $arrayRob[6],
                        'valorM4'=> $arrayRob[7],
                        'valorM3'=> $arrayRob[8],
                        'valorM2'=> $arrayRob[9],
                        'valorM1'=> $arrayRob[10],
                        'valorM0'=> $arrayRob[11]
            ];

            $data[] = ['indicador'=>'ROL',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRol[0],
                        'valorM10'=> $arrayRol[1],
                        'valorM9'=> $arrayRol[2],
                        'valorM8'=> $arrayRol[3],
                        'valorM7'=> $arrayRol[4],
                        'valorM6'=> $arrayRol[5],
                        'valorM5'=> $arrayRol[6],
                        'valorM4'=> $arrayRol[7],
                        'valorM3'=> $arrayRol[8],
                        'valorM2'=> $arrayRol[9],
                        'valorM1'=> $arrayRol[10],
                        'valorM0'=> $arrayRol[11]
            ];

            $data[] = ['indicador'=>'CMV',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCmv[0],
                        'valorM10'=> $arrayCmv[1],
                        'valorM9'=> $arrayCmv[2],
                        'valorM8'=> $arrayCmv[3],
                        'valorM7'=> $arrayCmv[4],
                        'valorM6'=> $arrayCmv[5],
                        'valorM5'=> $arrayCmv[6],
                        'valorM4'=> $arrayCmv[7],
                        'valorM3'=> $arrayCmv[8],
                        'valorM2'=> $arrayCmv[9],
                        'valorM1'=> $arrayCmv[10],
                        'valorM0'=> $arrayCmv[11]
            ];

            $data[] = ['indicador'=>'LB',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayLb[0],
                        'valorM10'=> $arrayLb[1],
                        'valorM9'=> $arrayLb[2],
                        'valorM8'=> $arrayLb[3],
                        'valorM7'=> $arrayLb[4],
                        'valorM6'=> $arrayLb[5],
                        'valorM5'=> $arrayLb[6],
                        'valorM4'=> $arrayLb[7],
                        'valorM3'=> $arrayLb[8],
                        'valorM2'=> $arrayLb[9],
                        'valorM1'=> $arrayLb[10],
                        'valorM0'=> $arrayLb[11]
            ];

            $data[] = ['indicador'=>'MB',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayMb[0],
                        'valorM10'=> $arrayMb[1],
                        'valorM9'=> $arrayMb[2],
                        'valorM8'=> $arrayMb[3],
                        'valorM7'=> $arrayMb[4],
                        'valorM6'=> $arrayMb[5],
                        'valorM5'=> $arrayMb[6],
                        'valorM4'=> $arrayMb[7],
                        'valorM3'=> $arrayMb[8],
                        'valorM2'=> $arrayMb[9],
                        'valorM1'=> $arrayMb[10],
                        'valorM0'=> $arrayMb[11]
            ];

            $data[] = ['indicador'=>'Quantidade',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayQtde[0],
                        'valorM10'=> $arrayQtde[1],
                        'valorM9'=> $arrayQtde[2],
                        'valorM8'=> $arrayQtde[3],
                        'valorM7'=> $arrayQtde[4],
                        'valorM6'=> $arrayQtde[5],
                        'valorM5'=> $arrayQtde[6],
                        'valorM4'=> $arrayQtde[7],
                        'valorM3'=> $arrayQtde[8],
                        'valorM2'=> $arrayQtde[9],
                        'valorM1'=> $arrayQtde[10],
                        'valorM0'=> $arrayQtde[11]
            ];

            $data[] = ['indicador'=>'Nota',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayNf[0],
                        'valorM10'=> $arrayNf[1],
                        'valorM9'=> $arrayNf[2],
                        'valorM8'=> $arrayNf[3],
                        'valorM7'=> $arrayNf[4],
                        'valorM6'=> $arrayNf[5],
                        'valorM5'=> $arrayNf[6],
                        'valorM4'=> $arrayNf[7],
                        'valorM3'=> $arrayNf[8],
                        'valorM2'=> $arrayNf[9],
                        'valorM1'=> $arrayNf[10],
                        'valorM0'=> $arrayNf[11]
            ];

            $data[] = ['indicador'=>'Cliente',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCc[0],
                        'valorM10'=> $arrayCc[1],
                        'valorM9'=> $arrayCc[2],
                        'valorM8'=> $arrayCc[3],
                        'valorM7'=> $arrayCc[4],
                        'valorM6'=> $arrayCc[5],
                        'valorM5'=> $arrayCc[6],
                        'valorM4'=> $arrayCc[7],
                        'valorM3'=> $arrayCc[8],
                        'valorM2'=> $arrayCc[9],
                        'valorM1'=> $arrayCc[10],
                        'valorM0'=> $arrayCc[11]
            ];

            $data[] = ['indicador'=>'TKM Cliente',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayTkmcc[0],
                        'valorM10'=> $arrayTkmcc[1],
                        'valorM9'=> $arrayTkmcc[2],
                        'valorM8'=> $arrayTkmcc[3],
                        'valorM7'=> $arrayTkmcc[4],
                        'valorM6'=> $arrayTkmcc[5],
                        'valorM5'=> $arrayTkmcc[6],
                        'valorM4'=> $arrayTkmcc[7],
                        'valorM3'=> $arrayTkmcc[8],
                        'valorM2'=> $arrayTkmcc[9],
                        'valorM1'=> $arrayTkmcc[10],
                        'valorM0'=> $arrayTkmcc[11]
            ];

            $data[] = ['indicador'=>'TKM Nota',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayTkmnf[0],
                        'valorM10'=> $arrayTkmnf[1],
                        'valorM9'=> $arrayTkmnf[2],
                        'valorM8'=> $arrayTkmnf[3],
                        'valorM7'=> $arrayTkmnf[4],
                        'valorM6'=> $arrayTkmnf[5],
                        'valorM5'=> $arrayTkmnf[6],
                        'valorM4'=> $arrayTkmnf[7],
                        'valorM3'=> $arrayTkmnf[8],
                        'valorM2'=> $arrayTkmnf[9],
                        'valorM1'=> $arrayTkmnf[10],
                        'valorM0'=> $arrayTkmnf[11]
            ];

            $data[] = ['indicador'=>'LB Cliente',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayLbcc[0],
                        'valorM10'=> $arrayLbcc[1],
                        'valorM9'=> $arrayLbcc[2],
                        'valorM8'=> $arrayLbcc[3],
                        'valorM7'=> $arrayLbcc[4],
                        'valorM6'=> $arrayLbcc[5],
                        'valorM5'=> $arrayLbcc[6],
                        'valorM4'=> $arrayLbcc[7],
                        'valorM3'=> $arrayLbcc[8],
                        'valorM2'=> $arrayLbcc[9],
                        'valorM1'=> $arrayLbcc[10],
                        'valorM0'=> $arrayLbcc[11]
            ];

            $data[] = ['indicador'=>'LB Nota',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayLbnf[0],
                        'valorM10'=> $arrayLbnf[1],
                        'valorM9'=> $arrayLbnf[2],
                        'valorM8'=> $arrayLbnf[3],
                        'valorM7'=> $arrayLbnf[4],
                        'valorM6'=> $arrayLbnf[5],
                        'valorM5'=> $arrayLbnf[6],
                        'valorM4'=> $arrayLbnf[7],
                        'valorM3'=> $arrayLbnf[8],
                        'valorM2'=> $arrayLbnf[9],
                        'valorM1'=> $arrayLbnf[10],
                        'valorM0'=> $arrayLbnf[11]
            ];
            
            $data[] = ['indicador'=>'ROB Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRobdia[0],
                        'valorM10'=> $arrayRobdia[1],
                        'valorM9'=> $arrayRobdia[2],
                        'valorM8'=> $arrayRobdia[3],
                        'valorM7'=> $arrayRobdia[4],
                        'valorM6'=> $arrayRobdia[5],
                        'valorM5'=> $arrayRobdia[6],
                        'valorM4'=> $arrayRobdia[7],
                        'valorM3'=> $arrayRobdia[8],
                        'valorM2'=> $arrayRobdia[9],
                        'valorM1'=> $arrayRobdia[10],
                        'valorM0'=> $arrayRobdia[11]
            ];
            
            $data[] = ['indicador'=>'ROL Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRoldia[0],
                        'valorM10'=> $arrayRoldia[1],
                        'valorM9'=> $arrayRoldia[2],
                        'valorM8'=> $arrayRoldia[3],
                        'valorM7'=> $arrayRoldia[4],
                        'valorM6'=> $arrayRoldia[5],
                        'valorM5'=> $arrayRoldia[6],
                        'valorM4'=> $arrayRoldia[7],
                        'valorM3'=> $arrayRoldia[8],
                        'valorM2'=> $arrayRoldia[9],
                        'valorM1'=> $arrayRoldia[10],
                        'valorM0'=> $arrayRoldia[11]
            ];
            
            $data[] = ['indicador'=>'CMV Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCmvdia[0],
                        'valorM10'=> $arrayCmvdia[1],
                        'valorM9'=> $arrayCmvdia[2],
                        'valorM8'=> $arrayCmvdia[3],
                        'valorM7'=> $arrayCmvdia[4],
                        'valorM6'=> $arrayCmvdia[5],
                        'valorM5'=> $arrayCmvdia[6],
                        'valorM4'=> $arrayCmvdia[7],
                        'valorM3'=> $arrayCmvdia[8],
                        'valorM2'=> $arrayCmvdia[9],
                        'valorM1'=> $arrayCmvdia[10],
                        'valorM0'=> $arrayCmvdia[11]
            ];
            
            $data[] = ['indicador'=>'LB Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayLbdia[0],
                        'valorM10'=> $arrayLbdia[1],
                        'valorM9'=> $arrayLbdia[2],
                        'valorM8'=> $arrayLbdia[3],
                        'valorM7'=> $arrayLbdia[4],
                        'valorM6'=> $arrayLbdia[5],
                        'valorM5'=> $arrayLbdia[6],
                        'valorM4'=> $arrayLbdia[7],
                        'valorM3'=> $arrayLbdia[8],
                        'valorM2'=> $arrayLbdia[9],
                        'valorM1'=> $arrayLbdia[10],
                        'valorM0'=> $arrayLbdia[11]
            ];
            
            $data[] = ['indicador'=>'Qtde Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayQtdedia[0],
                        'valorM10'=> $arrayQtdedia[1],
                        'valorM9'=> $arrayQtdedia[2],
                        'valorM8'=> $arrayQtdedia[3],
                        'valorM7'=> $arrayQtdedia[4],
                        'valorM6'=> $arrayQtdedia[5],
                        'valorM5'=> $arrayQtdedia[6],
                        'valorM4'=> $arrayQtdedia[7],
                        'valorM3'=> $arrayQtdedia[8],
                        'valorM2'=> $arrayQtdedia[9],
                        'valorM1'=> $arrayQtdedia[10],
                        'valorM0'=> $arrayQtdedia[11]
            ];
            
            $data[] = ['indicador'=>'Nota Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayNfdia[0],
                        'valorM10'=> $arrayNfdia[1],
                        'valorM9'=> $arrayNfdia[2],
                        'valorM8'=> $arrayNfdia[3],
                        'valorM7'=> $arrayNfdia[4],
                        'valorM6'=> $arrayNfdia[5],
                        'valorM5'=> $arrayNfdia[6],
                        'valorM4'=> $arrayNfdia[7],
                        'valorM3'=> $arrayNfdia[8],
                        'valorM2'=> $arrayNfdia[9],
                        'valorM1'=> $arrayNfdia[10],
                        'valorM0'=> $arrayNfdia[11]
            ];
            
            $data[] = ['indicador'=>'Cliente Dia',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCcdia[0],
                        'valorM10'=> $arrayCcdia[1],
                        'valorM9'=> $arrayCcdia[2],
                        'valorM8'=> $arrayCcdia[3],
                        'valorM7'=> $arrayCcdia[4],
                        'valorM6'=> $arrayCcdia[5],
                        'valorM5'=> $arrayCcdia[6],
                        'valorM4'=> $arrayCcdia[7],
                        'valorM3'=> $arrayCcdia[8],
                        'valorM2'=> $arrayCcdia[9],
                        'valorM1'=> $arrayCcdia[10],
                        'valorM0'=> $arrayCcdia[11]
            ];

            if($consultaEstoque){

                $data[] = ['indicador'=>'Estoque Inicial',
                            'vDecimos'=> 0,
                            'valorM11'=> $EstoqueMesInicial[0],
                            'valorM10'=> $EstoqueMesInicial[1],
                            'valorM9'=> $EstoqueMesInicial[2],
                            'valorM8'=> $EstoqueMesInicial[3],
                            'valorM7'=> $EstoqueMesInicial[4],
                            'valorM6'=> $EstoqueMesInicial[5],
                            'valorM5'=> $EstoqueMesInicial[6],
                            'valorM4'=> $EstoqueMesInicial[7],
                            'valorM3'=> $EstoqueMesInicial[8],
                            'valorM2'=> $EstoqueMesInicial[9],
                            'valorM1'=> $EstoqueMesInicial[10],
                            'valorM0'=> $EstoqueMesInicial[11]
                ];

                $data[] = ['indicador'=>'Estoque Final',
                            'vDecimos'=> 0,
                            'valorM11'=> $EstoqueMesFinal[0],
                            'valorM10'=> $EstoqueMesFinal[1],
                            'valorM9'=> $EstoqueMesFinal[2],
                            'valorM8'=> $EstoqueMesFinal[3],
                            'valorM7'=> $EstoqueMesFinal[4],
                            'valorM6'=> $EstoqueMesFinal[5],
                            'valorM5'=> $EstoqueMesFinal[6],
                            'valorM4'=> $EstoqueMesFinal[7],
                            'valorM3'=> $EstoqueMesFinal[8],
                            'valorM2'=> $EstoqueMesFinal[9],
                            'valorM1'=> $EstoqueMesFinal[10],
                            'valorM0'=> $EstoqueMesFinal[11]
                ];

                $data[] = ['indicador'=>'Dias de Estoque',
                            'vDecimos'=> 2,
                            'valorM11'=> $EstoqueDias[0],
                            'valorM10'=> $EstoqueDias[1],
                            'valorM9'=> $EstoqueDias[2],
                            'valorM8'=> $EstoqueDias[3],
                            'valorM7'=> $EstoqueDias[4],
                            'valorM6'=> $EstoqueDias[5],
                            'valorM5'=> $EstoqueDias[6],
                            'valorM4'=> $EstoqueDias[7],
                            'valorM3'=> $EstoqueDias[8],
                            'valorM2'=> $EstoqueDias[9],
                            'valorM1'=> $EstoqueDias[10],
                            'valorM0'=> $EstoqueDias[11]
                ];
            }

            $this->setCallbackData($data);
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarfichaitemgraficoAction()
    {
        $data = array();
        
        try {
            $idEmpresas     = $this->params()->fromPost('idEmpresas',null);
            $idMarcas       = $this->params()->fromPost('idMarcas',null);
            $codProdutos    = $this->params()->fromPost('codProdutos',null);
            $tpPessoas      = $this->params()->fromPost('tpPessoas',null);
            $data           = $this->params()->fromPost('data',null);
            $idCurvas       = $this->params()->fromPost('idCurvas',null);
            $idOmvUsers     = $this->params()->fromPost('idOmvUsers',null);
            $indicadoresAdd = $this->params()->fromPost('indicadoresAdd',null);

            $indicadoresAdd = json_decode($indicadoresAdd);
            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas = implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas = implode("','",json_decode($tpPessoas));
            }
            if($idCurvas){
                $idCurvas = implode("','",json_decode($idCurvas));
            }
            if($idOmvUsers){
                $idOmvUsers = implode("','",json_decode($idOmvUsers));
            }

            $andSql = '';
            if($idEmpresas){
                $andSql = " and vi.id_empresa in ($idEmpresas)";
            }

            if($idMarcas){
                $andSql .= " and m.id_marca in ($idMarcas)";
            }

            if($codProdutos){
                $andSql .= " and i.cod_item||c.descricao in ('$codProdutos')";
            }

            if($tpPessoas){
                $andSql .= " and p.tipo_pessoa in ('$tpPessoas')";
            }

            if($idCurvas){
                $andSql .= " and t.id_curva_abc in ('$idCurvas')";
            }
            
            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            if($data){
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc($sysdate,'MM'),-11)";
                $andSql .= " and trunc(vi.data_emissao, 'MM') <= add_months(trunc($sysdate,'MM'),0)";
            }else{
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)";
            }
            
            if($idOmvUsers){
                $andSql .= " and (vi.id_empresa, vi.id_item, vi.id_categoria) in (
                    select id_empresa, id_item, id_categoria
                      from js.omv_analise_log a 
                     where a.data_aprovacao >= add_months(sysdate, -12) -- Filtro de data também
                       and usuario_aprovacao in ('$idOmvUsers') -- Usuários selecioados
                  )
                  ";
            }
            
            $em = $this->getEntityManager();
            
            $meses = [null,
                     'Janeiro',
                     'Fevereiro',
                     'Março',
                     'Abril',
                     'Maio',
                     'Junho',
                     'Julho',
                     'Agosto',
                     'Setembro',
                     'Outubro',
                     'Novembro',
                     'Dezembro'];

            $conn = $em->getConnection();

            $sql = "select add_months(trunc($sysdate,'MM'),-11) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-10) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-9) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-8) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-7) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-6) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-5) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-4) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-3) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-2) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-1) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-0) as id from dual            
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data1 = array();
            $categories = array();

            $arrayDesc      = array();
            $arrayPreco     = array();
            $arrayImposto   = array();
            $arrayRolUni    = array();
            $arrayCusto     = array();
            $arrayImpostoPc = array();
            $arrayDescPc    = array();
            $arrayRob       = array();
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();
            $arrayMb        = array();
            $arrayQtde      = array();
            $arrayNf        = array();
            $arrayCc        = array();
            $arrayTkmcc     = array();
            $arrayTkmnf     = array();
            $arrayLbcc      = array();
            $arrayLbnf      = array();
            $arrayRobdia    = array();
            $arrayRoldia    = array();
            $arrayCmvdia    = array();
            $arrayLbdia     = array();
            $arrayQtdedia   = array();
            $arrayNfdia     = array();
            $arrayCcdia     = array();
            $arrayEtqMesIni = array();

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
                $arrayLucro[]       = 0;
                $arrayImpostoPc[]   = 0;
                $arrayDescPc[]      = 0;
                $arrayRob[]         = 0;
                $arrayRol[]         = 0;
                $arrayCmv[]         = 0;
                $arrayLb[]          = 0;
                $arrayMb[]          = 0;
                $arrayQtde[]        = 0;
                $arrayNf[]          = 0;
                $arrayCc[]          = 0;
                $arrayTkmcc[]       = 0;
                $arrayTkmnf[]       = 0;
                $arrayLbcc[]        = 0;
                $arrayLbnf[]        = 0;
                $arrayRobdia[]      = 0;
                $arrayRoldia[]      = 0;
                $arrayCmvdia[]      = 0;
                $arrayLbdia[]       = 0;
                $arrayQtdedia[]     = 0;
                $arrayNfdia[]       = 0;
                $arrayCcdia[]       = 0;
                $arrayEtqMesIni[]   = 0;

            }

            $consultaEstoque = false;
            $EstoqueMesInicial  = array();
            $EstoqueMesFinal    = array();
            $EstoqueDias        = array();

            if($indicadoresAdd){

                for ($i=0; $i < count($indicadoresAdd); $i++) { 
            
                    if($indicadoresAdd[$i]->value){
                        $consultaEstoque = true;
                    }
                }
            }

            if($consultaEstoque){

                $EstoqueMes = $this->estoquemes($idEmpresas,$idMarcas,$codProdutos,$data,$idCurvas,$idOmvUsers);
                $EstoqueMesInicial  = $EstoqueMes[0];
                $EstoqueMesFinal    = $EstoqueMes[1];
                $EstoqueDias        = $EstoqueMes[2];
            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.lucro_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rob,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc,
                            round((case when b.rol > 0 then b.rob/b.cc end),2) as tkm_cc,
                            round((case when b.rol > 0 then b.rob/b.nf end),2) as tkm_nf,
                            round((case when b.rol > 0 then b.lb/b.cc end),2) as lb_cc,
                            round((case when b.rol > 0 then b.lb/b.nf end),2) as lb_nf,
                            round((case when b.rob > 0 then b.rob/c.dias_uteis end),2) as rob_dia,
                            round((case when b.rol > 0 then b.rol/c.dias_uteis end),2) as rol_dia,
                            round((case when b.cmv > 0 then b.cmv/c.dias_uteis end),2) as cmv_dia,
                            round((case when b.lb > 0 then b.lb/c.dias_uteis end),2) as lb_dia,
                            round((case when b.qtde > 0 then b.qtde/c.dias_uteis end),2) as qtde_dia,
                            round((case when b.nf > 0 then b.nf/c.dias_uteis end),2) as nf_dia,
                            round((case when b.cc > 0 then b.cc/c.dias_uteis end),2) as cc_dia
                        from (select trunc(vi.data_emissao, 'MM') as data,
                                     round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                     round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                     round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
                                     round((case when sum(qtde) > 0 then sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(qtde) end),2) as lucro_uni,
                                     round((case when sum(qtde) > 0 then ((sum(vi.rob)-sum(vi.rol))/sum(rob))*100 end),2) as imposto_perc,
                                     round((case when sum(qtde) > 0 then (sum(vi.desconto)/sum(rob))*100 end),2) as desconto_perc,
                                     sum(vi.rob) as rob,
                                     sum(vi.rol) as rol,
                                     sum(vi.custo) as cmv,
                                     sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                     round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                     sum(vi.qtde) as qtde,
                                     count(distinct vi.numero_nf) as nf,
                                     count(distinct vi.id_pessoa) as cc
                                from pricing.vm_ie_ve_venda_item vi,
                                     ms.empresa e,
                                     ms.tb_item_categoria ic,
                                     ms.tb_item i,
                                     ms.tb_categoria c,
                                     ms.tb_marca m,
                                     ms.pessoa p,
                                     ms.tb_estoque t
                               where vi.id_empresa = e.id_empresa
                               and vi.id_item = ic.id_item
                               and vi.id_categoria = ic.id_categoria
                               and vi.id_item = i.id_item
                               and vi.id_categoria = c.id_categoria
                               and ic.id_marca = m.id_marca
                               and vi.id_pessoa = p.id_pessoa(+)
                               and vi.id_empresa = t.id_empresa
                               and vi.id_item = t.id_item
                               and vi.id_categoria = t.id_categoria
                               $andSql
                               group by trunc(vi.data_emissao, 'MM')) b,
                             (select MES AS DATA, DECODE(MES,'01/05/2019',DIAS_UTEIS+0.33,DIAS_UTEIS) AS DIAS_UTEIS
                                from PRICING.VW_DIAS_UTEIS
                              where EMP = 'REDE'
                              and mes >= add_months(trunc($sysdate,'MM'),-11) ) c
                     where b.data = c.data(+)
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('desconto_uni', new ValueStrategy);
            $hydrator->addStrategy('preco_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_uni', new ValueStrategy);
            $hydrator->addStrategy('rol_uni', new ValueStrategy);
            $hydrator->addStrategy('custo_uni', new ValueStrategy);
            $hydrator->addStrategy('lucro_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_perc', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rob', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('nf', new ValueStrategy);
            $hydrator->addStrategy('cc', new ValueStrategy);
            $hydrator->addStrategy('tkm_cc', new ValueStrategy);
            $hydrator->addStrategy('tkm_nf', new ValueStrategy);
            $hydrator->addStrategy('lb_cc', new ValueStrategy);
            $hydrator->addStrategy('lb_nf', new ValueStrategy);
            $hydrator->addStrategy('rob_dia', new ValueStrategy);
            $hydrator->addStrategy('rol_dia', new ValueStrategy);
            $hydrator->addStrategy('cmv_dia', new ValueStrategy);
            $hydrator->addStrategy('lb_dia', new ValueStrategy);
            $hydrator->addStrategy('qtde_dia', new ValueStrategy);
            $hydrator->addStrategy('nf_dia', new ValueStrategy);
            $hydrator->addStrategy('cc_dia', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            $cont = 0;

            foreach ($resultSet as $row) {

                $elementos = $hydrator->extract($row);

                if($categories[$cont] == $meses[(float)substr($elementos['data'], 3, 2)]){

                    $arrayDesc[$cont]        = (float)$elementos['descontoUni'];
                    $arrayPreco[$cont]       = (float)$elementos['precoUni'];
                    $arrayImposto[$cont]     = (float)$elementos['impostoUni'];
                    $arrayRolUni[$cont]      = (float)$elementos['rolUni'];
                    $arrayCusto[$cont]       = (float)$elementos['custoUni'];
                    $arrayLucro[$cont]       = (float)$elementos['lucroUni'];
                    $arrayImpostoPc[$cont]   = (float)$elementos['impostoPerc'];
                    $arrayDescPc[$cont]      = (float)$elementos['descontoPerc'];
                    $arrayRob[$cont]         = (float)$elementos['rob'];
                    $arrayRol[$cont]         = (float)$elementos['rol'];
                    $arrayCmv[$cont]         = (float)$elementos['cmv'];
                    $arrayLb[$cont]          = (float)$elementos['lb'];
                    $arrayMb[$cont]          = (float)$elementos['mb'];
                    $arrayQtde[$cont]        = (float)$elementos['qtde'];
                    $arrayNf[$cont]          = (float)$elementos['nf'];
                    $arrayCc[$cont]          = (float)$elementos['cc'];
                    $arrayTkmcc[$cont]       = (float)$elementos['tkmCc'];
                    $arrayTkmnf[$cont]       = (float)$elementos['tkmNf'];
                    $arrayLbcc[$cont]        = (float)$elementos['lbCc'];
                    $arrayLbnf[$cont]        = (float)$elementos['lbNf'];
                    $arrayRobdia[$cont]      = (float)$elementos['robDia'];
                    $arrayRoldia[$cont]      = (float)$elementos['rolDia'];
                    $arrayCmvdia[$cont]      = (float)$elementos['cmvDia'];
                    $arrayLbdia[$cont]       = (float)$elementos['lbDia'];
                    $arrayQtdedia[$cont]     = (float)$elementos['qtdeDia'];
                    $arrayNfdia[$cont]       = (float)$elementos['nfDia'];
                    $arrayCcdia[$cont]       = (float)$elementos['ccDia'];

                }

                $cont++;
            }

            $colors = ["#63b598","#ce7d78","#ea9e70","#a48a9e","#c6e1e8","#648177","#0d5ac1","#f205e6","#1c0365","#14a9ad","#4ca2f9"
                      ,"#a4e43f","#d298e2","#6119d0","#d2737d","#c0a43c","#f2510e","#651be6","#79806e","#61da5e","#cd2f00"];

            // $this->setCallbackData($data);
            return new JsonModel(
                array(
                    'success' => true,
                    'data' => array(
                        'categories' => $categories,
                        'series' => array(                            
                            array(
                                'name' => 'Preço Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(165,170,217,1)',
                                'data' => $arrayPreco,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                ),
                            ),
                            array(
                                'name' => 'Desconto Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(126,86,134,.9)',
                                'data' => $arrayDesc,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Imposto Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(46, 36, 183, 1)',
                                'data' => $arrayImposto,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRolUni,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Custo Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCusto,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Lucro Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayLucro,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Imposto',
                                'yAxis'=> 6,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayImpostoPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Desconto',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayDescPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROB',
                                'yAxis'=> 8,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRob,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL',
                                'yAxis'=> 8,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRol,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'CMV',
                                'yAxis'=> 8,
                                'color' => $colors[0],
                                'data' => $arrayCmv,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB',
                                'yAxis'=> 8,
                                'color' => $colors[1],
                                'data' => $arrayLb,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'MB',
                                'yAxis'=> 12,
                                'color' => $colors[2],
                                'data' => $arrayMb,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Quantidade',
                                'yAxis'=> 13,
                                'color' => $colors[3],
                                'data' => $arrayQtde,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Nota',
                                'yAxis'=> 14,
                                'color' => $colors[4],
                                'data' => $arrayNf,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Cliente',
                                'yAxis'=> 15,
                                'color' => $colors[5],
                                'data' => $arrayCc,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'TKM Cliente',
                                'yAxis'=> 16,
                                'color' => $colors[6],
                                'data' => $arrayTkmcc,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'TKM Nota',
                                'yAxis'=> 17,
                                'color' => $colors[7],
                                'data' => $arrayTkmnf,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB Cliente',
                                'yAxis'=> 18,
                                'color' => $colors[8],
                                'data' => $arrayLbcc,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB Nota',
                                'yAxis'=> 19,
                                'color' => $colors[9],
                                'data' => $arrayLbnf,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROB Dia',
                                'yAxis'=> 20,
                                'color'=> $colors[10],
                                'data' => $arrayRobdia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL Dia',
                                'yAxis'=> 21,
                                'color'=> $colors[11],
                                'data' => $arrayRoldia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'CMV Dia',
                                'yAxis'=> 22,
                                'color'=> $colors[12],
                                'data' => $arrayCmvdia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB Dia',
                                'yAxis'=> 23,
                                'color'=> $colors[13],
                                'data' => $arrayLbdia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Qtde Dia',
                                'yAxis'=> 24,
                                'color'=> $colors[14],
                                'data' => $arrayQtdedia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Nota Dia',
                                'yAxis'=> 25,
                                'color'=> $colors[15],
                                'data' => $arrayNfdia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Cliente Dia',
                                'yAxis'=> 26,
                                'color'=> $colors[16],
                                'data' => $arrayCcdia,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Estoque Inicial',
                                'yAxis'=> 27,
                                'color'=> $colors[17],
                                'data' => $EstoqueMesInicial,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Estoque Final',
                                'yAxis'=> 28,
                                'color'=> $colors[18],
                                'data' => $EstoqueMesFinal,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Dias de Estoque',
                                'yAxis'=> 29,
                                'color'=> $colors[19],
                                'data' => $EstoqueDias,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => false,
                                'showInLegend' => false,
                                'dataLabels' => array(
                                     'enabled' => true,
                                     'style' => array( 'fontSize' => '10')
                                    )
                            )
                        ),
                    )
                )
            );
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    
    public function listarprodutosAction()
    {
        $data = array();
        
        try {

            $pEmp    = $this->params()->fromQuery('emp',null);
            $pCod    = $this->params()->fromQuery('codItem',null);
            $tipoSql = $this->params()->fromQuery('tipoSql',null);

            if(!$pCod){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();

            if(!$tipoSql){
                $filtroProduto = "like upper('".$pCod."%')";
            }else{
                $produtos =  implode("','",json_decode($pCod));
                $filtroProduto = "in ('".$produtos."')";
            }
            
            $sql = "select i.cod_item||c.descricao as cod_item,
                           i.descricao,
                           m.descricao as marca
                        from ms.tb_item_categoria ic,
                        ms.tb_marca m,
                        ms.tb_item i,
                        ms.tb_categoria c
                    where ic.id_item = i.id_item
                    and ic.id_categoria = c.id_categoria
                    and ic.id_marca = m.id_marca
                    and i.cod_item||c.descricao $filtroProduto
                    order by cod_item asc";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('custo_contabil', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
    public function listarmarcaAction()
    {
        $data = array();

        $emp = $this->params()->fromQuery('emp',null);

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();
            
            $sql = "select  g.id_grupo_marca,
                            m.id_marca,
                            m.descricao as marca,
                            count(*) as skus
                    from ms.tb_estoque e,
                            ms.tb_item i,
                            ms.tb_categoria c,
                            ms.tb_item_categoria ic,
                            ms.tb_marca m,
                            ms.tb_grupo_marca g,
                            ms.empresa em
                    where e.id_item = i.id_item
                    and e.id_categoria = c.id_categoria
                    and e.id_item = ic.id_item
                    and e.id_categoria = ic.id_categoria
                    and ic.id_marca = m.id_marca
                    and m.id_grupo_marca = g.id_grupo_marca
                    and e.id_empresa = em.id_empresa
                    --and e.id_curva_abc = 'E'
                    and ( e.ultima_compra > add_months(sysdate, -6) or e.estoque > 0 )
                    group by g.id_grupo_marca, m.id_marca, m.descricao
                    order by skus desc
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
    public function listarcurvasAction()
    {
        $data = array();
        
        try {
            $session = $this->getSession();
            $usuario = $session['info']['usuarioSistema'];

            // $idEmpresa      = $this->params()->fromQuery('idEmpresa',null);

            $em = $this->getEntityManager();
            $conn = $em->getConnection();

            $sql = "select id_curva_abc from MS.TB_CURVA_ABC";

            $stmt = $conn->prepare($sql);
            // $stmt->bindParam(':idEmpresa', $idEmpresa);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('id_curva_abc', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            $this->setMessage("Solicitação enviada com sucesso.");
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listaromuusuarioAction()
    {
        $data = array();
        
        try {
            $session = $this->getSession();
            $usuario = $session['info']['usuarioSistema'];

            // $idEmpresa      = $this->params()->fromQuery('idEmpresa',null);

            $em = $this->getEntityManager();
            $conn = $em->getConnection();

            $sql = "select usuario_aprovacao as id_usuario,
                            usuario_aprovacao || ' ' || '(' || count(*) || ')' as usuario,
                            count(*) as total
                    from js.omv_analise_log a 
                    where a.data_aprovacao >= add_months(sysdate, -12) -- Padrão 24 meses
                    and usuario_aprovacao not in ('JS')
                    group by usuario_aprovacao
                    order by total desc";

            $stmt = $conn->prepare($sql);
            // $stmt->bindParam(':idEmpresa', $idEmpresa);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('id_usuario', new ValueStrategy);
            $hydrator->addStrategy('usuario', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            $this->setMessage("Solicitação enviada com sucesso.");
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
}
