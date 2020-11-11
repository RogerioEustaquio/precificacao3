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

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
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
            $idEmpresas = $this->params()->fromQuery('idEmpresas',null);
            $idMarcas   = $this->params()->fromQuery('idMarcas',null);
            $codProdutos= $this->params()->fromQuery('codProdutos',null);

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
                $andSql = " and id_empresa in ($idEmpresas)";
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
                        and id_empresa in (2)
                        and id_item = 84307
                        and id_categoria = 1";

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
            // $arrayPreco = array();
            // $arrayRol = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
                            
                $arrayPreco= [(float)$data[0]['valorM11'],
                              (float)$data[0]['valorM10'],
                              (float)$data[0]['valorM9'],
                              (float)$data[0]['valorM8'],
                              (float)$data[0]['valorM7'],
                              (float)$data[0]['valorM6'],
                              (float)$data[0]['valorM5'],
                              (float)$data[0]['valorM4'],
                              (float)$data[0]['valorM3'],
                              (float)$data[0]['valorM2'],
                              (float)$data[0]['valorM1'],
                              (float)$data[0]['valorM0']
                             ];
            }

            $arrayRol = [1271.569,
                        1339.661,
                        1258.922,
                        1192.778,
                        1123.123,
                        1044.219,
                        883.384,
                        824.531,
                        952.093,
                        1059.469,
                        1001.275,
                        961.114
                        ];
            $arrayLb = [377.161,
                        399.948,
                        378.895,
                        361.835,
                        340.188,
                        321.671,
                        270.296,
                        251.719,
                        281.072,
                        315.821,
                        298.878,
                        286.233
                    ];
            $arrayMb = [29.66,
                        29.85,
                        30.10,
                        30.34,
                        30.29,
                        30.80,
                        30.60,
                        30.53,
                        29.52,
                        29.81,
                        29.85,
                        29.78 ];
            // $this->setCallbackData($data);
            return new JsonModel(
                array(
                    'success' => 'true',
                    'data' => array(
                        'categories' => $categories,
                        'series' => array(
                            array(
                                'name' => 'Rol',
                                'yAxis'=> 0,
                                'color' => 'rgba(126,86,134,.9)',
                                'data' => $arrayRol,
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Preço',
                                'yAxis'=> 1,
                                'color' => 'rgba(165,170,217,1)',
                                'data' => $arrayPreco,
                                'visible' => false,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                ),
                            ),
                            array(
                                'name' => 'Lb',
                                'yAxis'=> 2,
                                'color' => 'rgba(46, 36, 183, 1)',
                                'data' => $arrayLb,
                                'visible' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Mb',
                                'yAxis'=> 3,
                                'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayMb,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'format' => '% {y}',
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
