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

    public function listaritensmarcasAction()
    {
        $data = array();
        
        try {

            $pData    = $this->params()->fromQuery('data',null);
            $idMarcas = $this->params()->fromQuery('idMarcas',null);

            $em = $this->getEntityManager();

            if($pData){
                $sysdate = "to_date('".$pData."')";
            }else{
                $sysdate = 'sysdate';
            }

            if($idMarcas){
                $idMarcas =  implode(",",json_decode($idMarcas));
            }
            $andMarca = '';
            if($idMarcas){
                $andMarca = "and ic.id_marca in ($idMarcas)";
            }
            
            $sql = "select marca,
                        dias_uteis_m0, -- Dias úteis atual
                        dias_uteis_m1, -- Dias úteis mês anterior
                        dias_uteis_3m, -- Dias úteis 3 meses
                        dias_uteis_6m, -- Dias úteis 6 meses
                        dias_uteis_12m, -- Dias úteis 12 meses
                        dias_uteis_24m, -- Dias úteis 24 meses
                
                        rol_dia_m0, -- ROL Dia Atual
                        rol_dia_m1, -- ROL Dia mês anterior
                        rol_dia_3m, -- ROL Dia 3 meses
                        rol_dia_6m, -- ROL Dia 6 meses
                        rol_dia_12m, -- ROL Dia 12 meses
                        rol_dia_24m, -- ROL Dia 24 meses   
                        rol_dia_ac_ano_ant, -- ROL Dia Ac. Ano Anterior  

                        round(100*(rol_dia_m0/rol_dia_m1-1),2) as rol_dia_m0_x_1m, -- ROL Dia Atual x Mês Anterior,
                        round(100*(rol_dia_m0/rol_dia_3m-1),2) as rol_dia_m0_x_3m, -- ROL Dia Atual x 3 Meses,
                        round(100*(rol_dia_m0/rol_dia_6m-1),2) as rol_dia_m0_x_6m, -- ROL Dia Atual x 6 Meses,
                        round(100*(rol_dia_m0/rol_dia_12m-1),2) as rol_dia_m0_x_12m, -- ROL Dia Atual x 12 Meses,
                        round(100*(rol_dia_m0/rol_dia_24m-1),2) as rol_dia_m0_x_24m, -- ROL Dia Atual x 24 Meses,
                        round(100*(rol_dia_m0/rol_dia_ac_ano_ant-1),2) as rol_dia_m0_x_ac_ano_ant, -- ROL Dia Atual x Ac. Ano Anterior    
                        
                        round(mb_m0,2) as mb_m0, -- MB Atual
                        round(mb_m1,2) as mb_m1, -- MB Mês Anterior
                        round(mb_ac_ano_ant,2) as mb_ac_ano_ant, -- MB Mês Anterior
                 
                        round(100*(mb_m0/mb_m1-1),2) as mb_m0_x_1m, -- ROL Dia Atual x Mês Anterior, 
                        round(100*(mb_m0/mb_ac_ano_ant-1),2) as mb_m0_x_ac_ano_ant, -- MARGEM BRUTA Atual x Ac. Ano Anterior,                     

                        estoque_valor -- Valor de Estoque  
                from (select a.marca,
                        
                                (case when rol_m0 > 0 then rol_m0/dias_uteis_m0 end) as rol_dia_m0,
                                (case when rol_m1 > 0 then rol_m1/dias_uteis_m1 end) as rol_dia_m1,    
                                (case when rol_3m > 0 then rol_3m/dias_uteis_3m end) as rol_dia_3m, 
                                (case when rol_6m > 0 then rol_6m/dias_uteis_6m end) as rol_dia_6m,
                                (case when rol_12m > 0 then rol_12m/dias_uteis_12m end) as rol_dia_12m,
                                (case when rol_24m > 0 then rol_24m/dias_uteis_24m end) as rol_dia_24m,     

                                (case when rol_ac_ano_ant > 0 then rol_ac_ano_ant/dias_uteis_ac_ano_ant end) as rol_dia_ac_ano_ant,

                                100*(case when rol_m0 > 0 then lb_m0/rol_m0 end) as mb_m0,
                                100*(case when rol_m1 > 0 then lb_m1/rol_m1 end) as mb_m1,
                                100*(case when rol_ac_ano_ant > 0 then lb_ac_ano_ant/rol_ac_ano_ant end) as mb_ac_ano_ant,                      

                                dias_uteis_m0,
                                dias_uteis_m1,
                                dias_uteis_3m,
                                dias_uteis_6m,
                                dias_uteis_12m,
                                dias_uteis_24m,
                
                                a.estoque_valor -- Valor de Estoque  
                        from (select ic.id_marca, m.descricao as marca, sum(e.estoque*e.custo_contabil) as estoque_valor
                                from ms.tb_estoque e, ms.tb_item_categoria ic, ms.tb_marca m
                                where e.id_item = ic.id_item
                                    and e.id_categoria = ic.id_categoria
                                    and ic.id_marca = m.id_marca
                                    $andMarca
                                group by ic.id_marca, m.descricao) a,
                                (select xv.id_marca,
                                        sum(case when xv.data = trunc($sysdate,'MM') then xv.rol end) as rol_m0,
                                        sum(case when xv.data = add_months(trunc($sysdate,'MM'),-1) then xv.rol end) as rol_m1,
                                        sum(case when xv.data > add_months(trunc($sysdate,'MM'),-3) and xv.data < trunc($sysdate,'MM') then xv.rol end) as rol_3m,
                                        sum(case when xv.data > add_months(trunc($sysdate,'MM'),-6) and xv.data < trunc($sysdate,'MM') then xv.rol end) as rol_6m,
                                        sum(case when xv.data > add_months(trunc($sysdate,'MM'),-12) and xv.data < trunc($sysdate,'MM') then xv.rol end) as rol_12m,
                                        sum(case when xv.data > add_months(trunc($sysdate,'MM'),-24) and xv.data < trunc($sysdate,'MM') then xv.rol end) as rol_24m,
                                        
                                        sum(case when xv.data >= add_months(trunc($sysdate,'RRRR'),-12) and xv.data <= trunc(add_months($sysdate,-12),'MM') then xv.rol end) as rol_ac_ano_ant,

                                        sum(case when xv.data = trunc($sysdate,'MM') then xv.lb end) as lb_m0,
                                        sum(case when xv.data = add_months(trunc($sysdate,'MM'),-1) then xv.lb end) as lb_m1,
                                        sum(case when xv.data >= add_months(trunc(sysdate,'RRRR'),-12) and xv.data <= trunc(add_months(sysdate,-12),'MM') then xv.lb end) as lb_ac_ano_ant,                

                                        sum(case when xd.data = trunc($sysdate,'MM') then xd.dias_uteis end) as dias_uteis_m0,
                                        sum(case when xd.data = add_months(trunc($sysdate,'MM'),-1) then xd.dias_uteis end) as dias_uteis_m1,
                                        sum(case when xd.data > add_months(trunc($sysdate,'MM'),-3) and xd.data < trunc($sysdate,'MM') then xd.dias_uteis end) as dias_uteis_3m,
                                        sum(case when xd.data > add_months(trunc($sysdate,'MM'),-6) and xd.data < trunc($sysdate,'MM') then xd.dias_uteis end) as dias_uteis_6m,
                                        sum(case when xd.data > add_months(trunc($sysdate,'MM'),-12) and xd.data < trunc($sysdate,'MM') then xd.dias_uteis end) as dias_uteis_12m,
                                        sum(case when xd.data > add_months(trunc($sysdate,'MM'),-24) and xd.data < trunc($sysdate,'MM') then xd.dias_uteis end) as dias_uteis_24m,

                                        sum(case when xd.data >= add_months(trunc($sysdate,'RRRR'),-12) and xd.data <= trunc(add_months($sysdate,-12),'MM') then xd.dias_uteis end) as dias_uteis_ac_ano_ant
                
                                from (select trunc(vi.data_emissao, 'MM') as data,
                                            ic.id_marca as id_marca,
                                            sum(vi.rob) as rob,
                                            sum(vi.rol) as rol,
                                            sum(vi.custo) as cmv,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                            round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                            sum(vi.qtde) as qtde,
                                            count(distinct vi.numero_nf) as nf,
                                            count(distinct vi.id_pessoa) as cc
                                        from pricing.vm_ie_ve_venda_item vi, ms.tb_item_categoria ic 
                                        where vi.id_item = ic.id_item
                                        and vi.id_categoria = ic.id_categoria
                                        
                                        and trunc(vi.data_emissao, 'MM') >= add_months(trunc($sysdate,'MM'), -13)
                
                                        group by trunc(vi.data_emissao, 'MM'), ic.id_marca) xv,
                                        
                                    (select MES AS DATA, DECODE(MES,'01/05/2019',DIAS_UTEIS+0.33,DIAS_UTEIS) AS DIAS_UTEIS
                                        from PRICING.VW_DIAS_UTEIS
                                        where EMP = 'REDE'
                                        and mes >= add_months(trunc($sysdate,'MM'), -24) ) xd
                                where xv.data = xd.data(+)
                                group by xv.id_marca) b
                        where a.id_marca = b.id_marca(+))
                order by nvl(rol_dia_m0,0) desc";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('marca', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_m0', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_m1', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_3m', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_6m', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_12m', new ValueStrategy);
            $hydrator->addStrategy('dias_uteis_24m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m1', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_3m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_6m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_12m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_24m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_ac_ano_ant', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_1m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_3m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_6m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_12m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_24m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_ac_ano_ant', new ValueStrategy);
            $hydrator->addStrategy('mb_m0', new ValueStrategy);
            $hydrator->addStrategy('mb_m1', new ValueStrategy);
            $hydrator->addStrategy('mb_ac_ano_ant', new ValueStrategy);
            $hydrator->addStrategy('mb_m0_x_1m', new ValueStrategy);
            $hydrator->addStrategy('mb_m0_x_ac_ano_ant', new ValueStrategy);
            $hydrator->addStrategy('estoque_valor', new ValueStrategy);
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

    public function listargrupoAction(){
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
