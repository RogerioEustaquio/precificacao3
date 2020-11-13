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
            $em = $this->getEntityManager();

            $sql = "select to_char(add_months(trunc(sysdate,'MM'),-11),'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-10),'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-9), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-8), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-7), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-6), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-5), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-4), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-3), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-2), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-1), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-0), 'MM') as id from dual
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

    public function listarfichaitemAction()
    {   
        $data = array();
        
        try {

            $idEmpresas = $this->params()->fromQuery('idEmpresas',null);
            $idMarcas   = $this->params()->fromQuery('idMarcas',null);
            $codProdutos= $this->params()->fromQuery('codProdutos',null);
            $tpPessoas  = $this->params()->fromQuery('tpPessoas',null);

            if($idEmpresas){
                $idEmpresas   =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas =  implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas =  implode("','",json_decode($tpPessoas));
            }

            if($idEmpresas){
                $andSql = " and id_empresa in ($idEmpresas)";
            }

            $em = $this->getEntityManager();
            
            $sql = "select 'PVM' as tipo,
                            t.id_empresa,
                            t.id_item,
                            t.id_categoria,
                            t.valor_m11,
                            t.valor_m10,
                            t.valor_m9,
                            t.valor_m8,
                            t.valor_m7,
                            t.valor_m6,
                            t.valor_m5,
                            t.valor_m4,
                            t.valor_m3,
                            t.valor_m2,
                            t.valor_m1,
                            t.valor_m0
                        from VW_PRODUTO_PRECO_TIMELINE t 
                        where 1 = 1
                        $andSql
                        and id_item = 84307
                        and id_categoria = 1";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('valor_m11', new ValueStrategy);
            $hydrator->addStrategy('valor_m10', new ValueStrategy);
            $hydrator->addStrategy('valor_m9', new ValueStrategy);
            $hydrator->addStrategy('valor_m8', new ValueStrategy);
            $hydrator->addStrategy('valor_m7', new ValueStrategy);
            $hydrator->addStrategy('valor_m6', new ValueStrategy);
            $hydrator->addStrategy('valor_m5', new ValueStrategy);
            $hydrator->addStrategy('valor_m4', new ValueStrategy);
            $hydrator->addStrategy('valor_m3', new ValueStrategy);
            $hydrator->addStrategy('valor_m2', new ValueStrategy);
            $hydrator->addStrategy('valor_m1', new ValueStrategy);
            $hydrator->addStrategy('valor_m0', new ValueStrategy);
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

    public function listarfichaitemgraficoAction()
    {   
        $data = array();
        
        try {
            $idEmpresas = $this->params()->fromPost('idEmpresas',null);
            $idMarcas   = $this->params()->fromPost('idMarcas',null);
            $codProdutos= $this->params()->fromPost('codProdutos',null);
            $tpPessoas  = $this->params()->fromPost('tpPessoas',null);

            if($idEmpresas){
                $idEmpresas   =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas =  implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas =  implode("','",json_decode($tpPessoas));
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

            $sql = "select to_char(add_months(trunc(sysdate,'MM'),-11),'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-10),'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-9), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-8), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-7), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-6), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-5), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-4), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-3), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-2), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-1), 'MM') as id from dual union all
                    select to_char(add_months(trunc(sysdate,'MM'),-0), 'MM') as id from dual
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
            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float)$data1['id']];
            }

            $sql = "select a.data,
                           b.desconto_uni,
                           b.preco_uni,
                           b.imposto_uni,
                           b.rol_uni,
                           b.custo_uni,
                           b.desconto_perc,
                           b.rol,
                           b.cmv,
                           b.lb,
                           b.qtde,
                           b.nf,
                           b.cc
                    from (select distinct trunc(data_emissao, 'MM') as data
                            from pricing.vm_ie_ve_venda_item 
                          where trunc(data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)
                          order by data asc) a,
                         (select trunc(vi.data_emissao, 'MM') as data,
                                 round(sum(vi.desconto)/sum(qtde),2) as desconto_uni,
                                 round(sum(vi.rob)/sum(qtde),2) as preco_uni,
                                 round((sum(vi.rob)-sum(vi.rol))/sum(qtde),2) as imposto_uni,
                                 round(sum(vi.rol)/sum(qtde),2) as rol_uni,
                                 round(sum(vi.custo)/sum(qtde),2) as custo_uni,
                                 round((sum(vi.desconto)/sum(rob))*100,2) as desconto_perc,
                                 sum(vi.rol) as rol,
                                 sum(vi.custo) as cmv,
                                 sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                 sum(vi.qtde) as qtde,
                                 count(distinct vi.numero_nf) as nf,
                                 count(distinct vi.id_pessoa) as cc
                            from pricing.vm_ie_ve_venda_item vi,
                                 ms.empresa e,
                                 ms.tb_item_categoria ic,
                                 ms.tb_item i,
                                 ms.tb_categoria c,
                                 ms.tb_marca m, ms.pessoa p
                           where vi.id_empresa = e.id_empresa
                           and vi.id_item = ic.id_item
                           and vi.id_categoria = ic.id_categoria
                           and vi.id_item = i.id_item
                           and vi.id_categoria = c.id_categoria
                           and ic.id_marca = m.id_marca
                           and vi.id_pessoa = p.id_pessoa(+)                           
                           and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)
                           $andSql
                           group by trunc(vi.data_emissao, 'MM')) b
                    where a.data = b.data(+)
            ";

            // print "$sql";
            // exit;

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('preco_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_uni', new ValueStrategy);
            $hydrator->addStrategy('rol_uni', new ValueStrategy);
            $hydrator->addStrategy('custo_uni', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data           = array();
            $arrayDesc      = array();
            $arrayPreco     = array();
            $arrayImposto   = array();
            $arrayRolUni    = array();
            $arrayCusto     = array();
            $arrayDescPc    = array();
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();

            foreach ($resultSet as $row) {

                $elementos = $hydrator->extract($row);

                $arrayDesc[]    = (float)$elementos['descontoUni'];
                $arrayPreco[]   = (float)$elementos['precoUni'];
                $arrayImposto[] = (float)$elementos['impostoUni'];
                $arrayRolUni[]  = (float)$elementos['rolUni'];
                $arrayCusto[]   = (float)$elementos['custoUni'];
                $arrayDescPc[]  = (float)$elementos['descontoPerc'];
                $arrayRol[]     = (float)$elementos['rol'];
                $arrayCmv[]     = (float)$elementos['cmv'];
                $arrayLb[]      = (float)$elementos['lb'];
                // $arrayMb[] = (float)$elementos['lb'];
            }

            // $this->setCallbackData($data);
            return new JsonModel(
                array(
                    'success' => true,
                    'data' => array(
                        'categories' => $categories,
                        'series' => array(
                            array(
                                'name' => 'Desconto',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(126,86,134,.9)',
                                'data' => $arrayDesc,
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Preço',
                                'yAxis'=> 1,
                                // 'color' => 'rgba(165,170,217,1)',
                                'data' => $arrayPreco,
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
                                ),
                            ),
                            array(
                                'name' => 'Imposto',
                                'yAxis'=> 2,
                                // 'color' => 'rgba(46, 36, 183, 1)',
                                'data' => $arrayImposto,
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Rol Unitário',
                                'yAxis'=> 3,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRolUni,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Custo',
                                'yAxis'=> 4,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCusto,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => '% Desconto',
                                'yAxis'=> 5,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayDescPc,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '%',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'ROL',
                                'yAxis'=> 6,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRol,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => 'R$',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'CMV',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCmv,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'LB',
                                'yAxis'=> 8,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayLb,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
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
    
}
