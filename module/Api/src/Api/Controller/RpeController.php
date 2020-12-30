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

class RpeController extends AbstractRestfulController
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
                    where e.id_empresa not in (26, 27, 28, 11, 20, 102, 101)
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

    public function listaritenslojaAction()
    {
        $data = array();
        
        try {

            $pData    = $this->params()->fromQuery('data',null);

            $em = $this->getEntityManager();
            
            $sql = "
            select 'RA' emp, '123,98' valor1, '20,65' valor2 from dual union
            select 'PA' emp, '100,98' valor1, '-10' valor2 from dual union
            select 'GO' emp, '64,00' valor1, '-1,65' valor2 from dual ";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('valor1', new ValueStrategy);
            $hydrator->addStrategy('valor2', new ValueStrategy);
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

    public function listargrupomarcaAction(){
        // return array idEmpresas

        $marcas = array();

        $marcas[] = ['id'=> 'G1 EVERTONOPE','idMarcas'=> [10376,
        580,598,10426,181,583,10307,602,10103,10020,172,334,77,175,64,10407,10406,10160,106,10016,117,522,270,8,7,
        10102,10223,10123,10410,1017,10158,10129,10011,195,73,10137,582,100,354,10394,10325,99,88,10202,82,10146,
        300,10351,10418,214,542,10023,10321,349,584,293,341,1013,10017,3,555,556,10148,10157,566,10388,122,538,330,
        1020,342,10176,567,23593,81,200,60,616,319,264,289,10396,70,148,10341,47,304,10186,134,10353,105,610,10100,
        10141,10026,10029,10436,10237,288,1001,10201,51,10200,154
        ]];
        $marcas[] = ['id'=> 'G2 MAYKONRS','idMarcas'=> [10159,10104,163,10412,10421,10101,10314,10126,10154,59,10305,
        205,10281,10316,10302,92,199,61,1012,10133,10405,10244,10444,10300,197,10013,10136,10413,10411,10422,10415,10373,
        302,617,10027,10198,9,10,10372,11,12,10403,322,97,10395,10419,23,539,10014,10140,10414,113,104,10423,10139,261,
        280,519,10107,10404,10425,10193,346,10153,10375,10440,140,10345,244,335,356,10191,10184,255,10112,121,83,10409,
        279,10179,10420,150
        ]];
        $marcas[] = ['id'=> 'G3 WELISONOPE','idMarcas'=> [161,10328,10192,13,131,612,10301,10174,290,10293,10131,169,604,
        211,115,143,10342,10343,10432,10143,553,10021,10274,10279,10386,10235,620,267,10295,10135,38,10441,10187,10352,89,
        75,76,10400,10319,206,594,10416,10234,613,22,10196,10206,10433,146,282,10389,314,74,560,1015,9999,72,10114,351,
        10165,328,19,10355,10178,10183,614
        ]];

        $this->setCallbackData($marcas);
        return $this->getCallbackModel();
    }
    
}
