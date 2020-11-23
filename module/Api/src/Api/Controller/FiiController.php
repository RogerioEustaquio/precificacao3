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

            $idEmpresas = $this->params()->fromPost('idEmpresas',null);
            $idMarcas   = $this->params()->fromPost('idMarcas',null);
            $codProdutos= $this->params()->fromPost('codProdutos',null);
            $tpPessoas  = $this->params()->fromPost('tpPessoas',null);
            $data       = $this->params()->fromPost('data',null);

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
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();
            $arrayMb        = array();
            $arrayQtde      = array();
            $arrayNf        = array();
            $arrayCc        = array();

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
                $arrayImpostoPc[]   = 0;
                $arrayDescPc[]      = 0;
                $arrayRol[]         = 0;
                $arrayCmv[]         = 0;
                $arrayLb[]          = 0;
                $arrayMb[]          = 0;
                $arrayQtde[]        = 0;
                $arrayNf[]          = 0;
                $arrayCc[]          = 0;

            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc
                    from (select trunc(vi.data_emissao, 'MM') as data,
                                  round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                  round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
                                  round((case when sum(qtde) > 0 then ((sum(vi.rob)-sum(vi.rol))/sum(rob))*100 end),2) as imposto_perc,
                                  round((case when sum(qtde) > 0 then (sum(vi.desconto)/sum(rob))*100 end),2) as desconto_perc,
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
                                ms.pessoa p
                           where vi.id_empresa = e.id_empresa
                           and vi.id_item = ic.id_item
                           and vi.id_categoria = ic.id_categoria
                           and vi.id_item = i.id_item
                           and vi.id_categoria = c.id_categoria
                           and ic.id_marca = m.id_marca
                           and vi.id_pessoa = p.id_pessoa(+)
                           $andSql
                           group by trunc(vi.data_emissao, 'MM')) b
                    where 1 = 1
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
            $hydrator->addStrategy('imposto_perc', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('nf', new ValueStrategy);
            $hydrator->addStrategy('cc', new ValueStrategy);
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
                    $arrayImpostoPc[$cont]   = (float)$elementos['impostoPerc'];
                    $arrayDescPc[$cont]      = (float)$elementos['descontoPerc'];
                    $arrayRol[$cont]         = (float)$elementos['rol'];
                    $arrayCmv[$cont]         = (float)$elementos['cmv'];
                    $arrayLb[$cont]          = (float)$elementos['lb'];
                    $arrayMb[$cont]          = (float)$elementos['mb'];
                    $arrayQtde[$cont]        = (float)$elementos['qtde'];
                    $arrayNf[$cont]          = (float)$elementos['nf'];
                    $arrayCc[$cont]          = (float)$elementos['cc'];
                }

                $cont++;
            }

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
            $data       = $this->params()->fromPost('data',null);

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

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
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

            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rob,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc
                    from (select trunc(vi.data_emissao, 'MM') as data,
                                  round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                  round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
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
                                ms.pessoa p
                           where vi.id_empresa = e.id_empresa
                           and vi.id_item = ic.id_item
                           and vi.id_categoria = ic.id_categoria
                           and vi.id_item = i.id_item
                           and vi.id_categoria = c.id_categoria
                           and ic.id_marca = m.id_marca
                           and vi.id_pessoa = p.id_pessoa(+)
                           $andSql
                           group by trunc(vi.data_emissao, 'MM')) b
                    where 1 = 1
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
                }

                $cont++;
            }

            $colors = ["#63b598","#ce7d78","#ea9e70","#a48a9e","#c6e1e8","#648177","#0d5ac1","#f205e6","#1c0365","#14a9ad","#4ca2f9"];

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
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => 'R$ {y}',
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
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
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
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
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
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => '{y}',
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
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Imposto',
                                'yAxis'=> 5,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayImpostoPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Desconto',
                                'yAxis'=> 6,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayDescPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '%',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROB',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRob,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => 'R$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRol,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => 'R$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'CMV',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCmv,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB',
                                'yAxis'=> 7,
                                'color' => $colors[0],
                                'data' => $arrayLb,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'MB',
                                'yAxis'=> 10,
                                'color' => $colors[1],
                                'data' => $arrayMb,
                                'vFormat' => '',
                                'vDecimos' => '',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Quantidade',
                                'yAxis'=> 11,
                                'color' => $colors[2],
                                'data' => $arrayQtde,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Nota Fiscal',
                                'yAxis'=> 12,
                                'color' => $colors[3],
                                'data' => $arrayNf,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Cliente',
                                'yAxis'=> 13,
                                'color' => $colors[4],
                                'data' => $arrayCc,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
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
    
}
