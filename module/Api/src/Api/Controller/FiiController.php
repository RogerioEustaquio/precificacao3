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
            
            
            $sql = "select to_char(add_months(trunc(sysdate,'MM'),-11), 'MM') as id from dual union all
            select to_char(add_months(trunc(sysdate,'MM'),-10), 'MM') as id from dual union all
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
                            t.valor_m0,
                            to_char(add_months(trunc(sysdate,'MM'),-0), 'MM') as mes_m0,
                            t.valor_m1,
                            to_char(add_months(trunc(sysdate,'MM'),-1), 'MM') as mes_m1,
                            t.valor_m2,
                            to_char(add_months(trunc(sysdate,'MM'),-2), 'MM') as mes_m2,
                            t.valor_m3,
                            to_char(add_months(trunc(sysdate,'MM'),-3), 'MM') as mes_m3,
                            t.valor_m4,
                            to_char(add_months(trunc(sysdate,'MM'),-4), 'MM') as mes_m4,
                            t.valor_m5,
                            to_char(add_months(trunc(sysdate,'MM'),-5), 'MM') as mes_m5,
                            t.valor_m6,
                            to_char(add_months(trunc(sysdate,'MM'),-6), 'MM') as mes_m6,
                            t.valor_m7,
                            to_char(add_months(trunc(sysdate,'MM'),-7), 'MM') as mes_m7,
                            t.valor_m8,
                            to_char(add_months(trunc(sysdate,'MM'),-8), 'MM') as mes_m8,
                            t.valor_m9,
                            to_char(add_months(trunc(sysdate,'MM'),-9), 'MM') as mes_m9,
                            t.valor_m10,
                            to_char(add_months(trunc(sysdate,'MM'),-10), 'MM') as mes_m10,
                            t.valor_m11,
                            to_char(add_months(trunc(sysdate,'MM'),-11), 'MM') as mes_m11
                        from VW_PRODUTO_PRECO_TIMELINE t 
                        where id_empresa in (2,18)
                        and id_item = 84307
                        and id_categoria = 1";
            
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('valor_m13', new ValueStrategy);
            $hydrator->addStrategy('valor_m12', new ValueStrategy);
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
    
}
