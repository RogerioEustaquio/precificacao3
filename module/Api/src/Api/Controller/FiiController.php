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

    public function listarempresasAction()
    {   
        $data = array();
        
        try {
            $em = $this->getEntityManager();
            
            
            $sql = "
                SELECT ID_EMPRESA, APELIDO AS EMPRESA, NOME FROM MS.EMPRESA WHERE ID_MATRIZ = 1 ORDER BY EMPRESA
            ";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll();
            
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }
        
        $json = new JsonModel($data);
        return $this->getResponseWithHeader()->setContent($json->serialize());
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
                        and id_empresa in (2,18,15,17,19)
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
                                // 'yAxis'=> 2,
                                'color' => 'rgba(126,86,134,.9)',
                                'data' => $arrayRol,
                                'dataLabels' => array(
                                    'enabled' => 'true',
                                    'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Preço',
                                'yAxis'=> 1,
                                'color' => 'rgba(165,170,217,1)',
                                'data' => $arrayPreco,
                                'dataLabels' => array(
                                    'enabled' => 'true',
                                    'format' => '{y}',
                                    'style' => array( 'fontSize' => '8')
                                    )
                            ),
                            array(
                                'name' => 'Lb',
                                'yAxis'=> 2,
                                'color' => 'rgba(46, 36, 183, 1)',
                                'data' => $arrayLb,
                                'dataLabels' => array(
                                    'enabled' => 'true',
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
                                    'enabled' => 'true',
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
    
}
