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

    public function listargrupomarcaAction(){
        // return array idEmpresas

        $marcas = array();

        // $marcas[] = ['id'=> 'G1 EVERTONOPE','idMarcas'=> [10376,
        // 580,598,10426,181,583,10307,602,10103,10020,172,334,77,175,64,10407,10406,10160,106,10016,117,522,270,8,7,
        // 10102,10223,10123,10410,1017,10158,10129,10011,195,73,10137,582,100,354,10394,10325,99,88,10202,82,10146,
        // 300,10351,10418,214,542,10023,10321,349,584,293,341,1013,10017,3,555,556,10148,10157,566,10388,122,538,330,
        // 1020,342,10176,567,23593,81,200,60,616,319,264,289,10396,70,148,10341,47,304,10186,134,10353,105,610,10100,
        // 10141,10026,10029,10436,10237,288,1001,10201,51,10200,154
        // ]];
        // $marcas[] = ['id'=> 'G2 MAYKONRS','idMarcas'=> [10159,10104,163,10412,10421,10101,10314,10126,10154,59,10305,
        // 205,10281,10316,10302,92,199,61,1012,10133,10405,10244,10444,10300,197,10013,10136,10413,10411,10422,10415,10373,
        // 302,617,10027,10198,9,10,10372,11,12,10403,322,97,10395,10419,23,539,10014,10140,10414,113,104,10423,10139,261,
        // 280,519,10107,10404,10425,10193,346,10153,10375,10440,140,10345,244,335,356,10191,10184,255,10112,121,83,10409,
        // 279,10179,10420,150
        // ]];
        // $marcas[] = ['id'=> 'G3 WELISONOPE','idMarcas'=> [161,10328,10192,13,131,612,10301,10174,290,10293,10131,169,604,
        // 211,115,143,10342,10343,10432,10143,553,10021,10274,10279,10386,10235,620,267,10295,10135,38,10441,10187,10352,89,
        // 75,76,10400,10319,206,594,10416,10234,613,22,10196,10206,10433,146,282,10389,314,74,560,1015,9999,72,10114,351,
        // 10165,328,19,10355,10178,10183,614
        // ]];

        $marcas[] = ['id'=> 'G1 EVERTONOPE','idMarcas'=> [181,99,10146,300,542,584,341,1013,10388,538,342,10176,567,289,10396,70,10353,
        131,10174,604,211,10143,10021,620,267,10295,10187,10352,89,594,10206,9999,10165,10355,92,
        #N/D,
        113,104,261,140,10184,10112,121,83]];

        $marcas[] = ['id'=> 'G2 MAYKONRS','idMarcas'=> [39,10426,10307,10407,10406,106,270,8,7,10102,
        #N/D,
        10123,10410,1017,10158,10129,195,10394,10017,3,555,556,10148,10157,
        1020,60,319,148,10341,610,10100,10141,10026,10029,288,1001,10201,10200,154,10328,10342,10343,10432,10279,10386,38,75,76,613,22,
        10433,351,19,10159,10412,10421,10314,10126,10154,199,61,1012,10133,10405,10444,10300,197,10411,10422,10027,10198,9,10,10372,11,
        12,10403,322,10419,23,539,10014,10140,10414,280,519,10404,10375,10440,244,356,10191,255,10409,279,10179,10420
        ]];

        $marcas[] = ['id'=> 'G3 WELISONOPE','idMarcas'=> [349,293,10436,10389,583,172,10160,10016,117,522,10011,73,10137,582,354,10325,
        88,10202,82,10351,214,10023,10321,122,93,81,616,47,10186,134,105,51,161,10135,206,10416,10234,74,560,1015,72,10114,328,10178,
        10183,614,163,10101,59,10305,205,10281,10415,302,617,97,10395,10423,10139,10425,10193,150
        ]];

        $marcas[] = ['id'=> 'G4 INATIVO','idMarcas'=> [226,10306,10144,273,
        #N/D,
        570,10379,178,87,204,586,309,10297,10149,10292,310,10164,118,10268,10185,1014,216,10177,69,
        #N/D,
        10348,225,569,10169,10155,1000,336,26,10099,266,559,10166,568,337,15,10018,572,10245,10251,10142,298,132,587,
        10329,10175,323,10118,248,251,540,100559,147,10354,2,10236,10326,10376,580,598,602,10103,10020,334,77,175,64,100,10418,
        566,330,235,200,
        #N/D,
        304,10237,10192,13,612,10301,290,10293,10131,169,115,143,553,10274,10235,10441,10400,10319,10196,
        146,282,314,10104,10316,10302,10244,10013,10413,10373,10107,346,10153,10345,335
        ]];

        $this->setCallbackData($marcas);
        return $this->getCallbackModel();
    }

    public function listareixosAction()
    {
        $data = array();
        
        try {

            // $pEmp    = $this->params()->fromQuery('emp',null);

            $data[] = ['id'=> 'ROL','name'=> 'ROL','vExemplo'=> 1000000];
            $data[] = ['id'=> 'MB','name'=> 'MB','vExemplo'=> 30];
            $data[] = ['id'=> 'CC','name'=> 'CC','vExemplo'=> 1000];
            $data[] = ['id'=> 'ESTOQUEVALOR','name'=> 'Estoque Valor','vExemplo'=> 200];

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }
    
}
