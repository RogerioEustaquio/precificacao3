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

class ApiBcbController extends AbstractRestfulController
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

    public function myCurl($url){
        // return array idEmpresas

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_FAILONERROR, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // $output contains the output string
        $output = curl_exec($ch);
        
        // close curl resource to free up system resources
        curl_close($ch);

        return json_decode($output);
    }

    public function dolarcomercialAction()
    {
        $dataInicio = $this->params()->fromPost('datainicio',null);
        $dataFim    = $this->params()->fromPost('datafim',null);

        try {
            $em = $this->getEntityManager();

            if($dataFim){
                $sysdate = substr($dataFim,3,2).'/'.substr($dataFim,0,2).'/'.substr($dataFim,6,4);
                $sysdate = "to_date('$sysdate')";
            }else{
                $sysdate = 'sysdate';
            }
            
            $meses = [null,
                     'Jan',
                     'Fev',
                     'Mar',
                     'Abr',
                     'Mai',
                     'Jun',
                     'Jul',
                     'Ago',
                     'Set',
                     'Out',
                     'Nov',
                     'Dez'];

            $conn = $em->getConnection();

            $sql = "select to_char(add_months(trunc($sysdate,'MM'),-11),'MM') as id, to_char($sysdate - 334.584,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-10),'MM') as id, to_char($sysdate - 304,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-9), 'MM') as id, to_char($sysdate - 273,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-8), 'MM') as id, to_char($sysdate - 243,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-7), 'MM') as id, to_char($sysdate - 212,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-6), 'MM') as id, to_char($sysdate - 182,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-5), 'MM') as id, to_char($sysdate - 152,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-4), 'MM') as id, to_char($sysdate - 121,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-3), 'MM') as id, to_char($sysdate - 91,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-2), 'MM') as id, to_char($sysdate - 60,'mm-dd-yyyy') dataa from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-1), 'MM') as id, to_char($sysdate - 30,'mm-dd-yyyy') data from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-0), 'MM') as id, to_char($sysdate ,'mm-dd-yyyy') data  from dual        
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            // $resultSet->initialize($results);

            $xAxisCategories = array();
            $cotacaoCompra = array();
            $cotacaoVenda  = array();

            for ($i=0; $i < count($results); $i++) {
                
                $xAxisCategories[] = $meses[(float)$results[$i]['ID']];

                $cotacaoCompra[] = 0;
                $cotacaoVenda[]  = 0;
            }

            $dataInicio = $results[0]['DATA'];
            $dataFim    = $results[11]['DATA'];

            $url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='$dataInicio'&@dataFinalCotacao='$dataFim'&\$top=400&\$format=json";

            // $output contains the output string
            $objReturn = $this->myCurl($url);

            $array = $objReturn->value;
            $contSeries = 0;
            $i2 = 0;

            for ($i=0; $i < count($array) ; $i++) {

                $i2 = ($i > 0) ? ($i-1) : $i ;

                if(substr($array[$i]->dataHoraCotacao,5,2) != substr($array[$i2]->dataHoraCotacao,5,2) && $i2 >0){

                    $cotacaoCompra[$contSeries]    = (float) $array[$i2]->cotacaoCompra;
                    $cotacaoVenda[$contSeries]     = (float) $array[$i2]->cotacaoVenda;

                    $contSeries++;

                }

                if(count($array)-1 == $i){
                    
                    $cotacaoCompra[$contSeries]    = (float) $array[$i]->cotacaoCompra;
                    $cotacaoVenda[$contSeries]     = (float) $array[$i]->cotacaoVenda;

                    $contSeries++;

                }
                
            }

            $data = array();
            $data['categories']    = $xAxisCategories;

            $data['series']  = array(
                                        array(
                                            'name' => 'Cotação Compra',
                                            'yAxis'=> 0,
                                            // 'color' => 'rgba(165,170,217,1)',
                                            'data' => $cotacaoCompra,
                                            'vFormat' => '',
                                            'vDecimos' => '2',
                                            'visible' => true,
                                            'showInLegend' => false,
                                            'dataLabels' => array(
                                                'enabled' => true,
                                                'style' =>  array( 'fontSize' => '10',
                                                                    'font-family'=> "Courier New",
                                                                    'fontWeight' => "normal !important"
                                                                )
                                            ),
                                        ),
                                        array(
                                            'name' => 'Cotação Venda',
                                            'yAxis'=> 0,
                                            // 'color' => 'rgba(126,86,134,.9)',
                                            'data' => $cotacaoVenda,
                                            'vFormat' => '',
                                            'vDecimos' => '2',
                                            'visible' => false,
                                            'showInLegend' => false,
                                            'dataLabels' => array(
                                                'enabled' => true,
                                                'style' => array( 'fontSize' => '10',
                                                                  'font-family'=> "Courier New",
                                                                  'fontWeight' => "normal !important"
                                                                 )
                                                )
                                        )
                                    );

            // $data = array();
            // foreach ($resultSet as $row) {
            //     $data[] = $hydrator->extract($row);
            // }

            $this->setCallbackData($data);
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

}
