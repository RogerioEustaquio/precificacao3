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

class MarcabrandpositioningController extends AbstractRestfulController
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

    public function marcabrandpositioningAction()
    {
        $data = array();
        
        try {

            $idEmpresas = $this->params()->fromPost('idEmpresas',null);
            $pData      = $this->params()->fromPost('data',null);
            $pDataInicio= $this->params()->fromPost('datainicio',null);
            $pDataFim   = $this->params()->fromPost('datafim',null);
            $idMarcas   = $this->params()->fromPost('idMarcas',null);

            $em = $this->getEntityManager();

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
            }
            
            $andEmpEstoque = '';
            $andEmpVi      = '';
            $andEmpUteis   = '';
            if($idEmpresas){
                $andEmpUteis   = "and vi.id_empresa in ($idEmpresas)";
            }else{
                $andEmpUteis = "and vi.id_empresa not in (26)";
            }

            $andData = '';
            if($pDataInicio){
                $andData = "and trunc(vi.data_emissao) >= to_date('".$pDataInicio."')";
                $sysdateInicio = "to_date('".$pDataInicio."')";
            }else{
                $sysdateInicio = 'add_months(trunc(sysdate,\'MM\'),-0)';
                $andData = "and trunc(vi.data_emissao) >= to_char($sysdateInicio,'dd/mm/yyyy')";
            }
            if($pDataFim){
                $andData .= " and trunc(vi.data_emissao) <= to_date('".$pDataFim."')";
                $sysdateFim = "to_date('".$pDataFim."')";
            }else{
                $sysdateFim = 'sysdate';
                $andData .= " and trunc(vi.data_emissao) <= sysdate";
            }

            if($pData){
                $sysdate = "to_date('01/".substr($pData,3,5)."')";
            }else{
                $sysdate = "to_date('01/'||to_char(sysdate,'mm/yyyy'))";
            }

            if($idMarcas){
                $idMarcas =  implode(",",json_decode($idMarcas));
            }
            $andMarca = '';
            $andmed_accumulated = '';
            if($idMarcas){
                $andMarca = "and ic.id_marca in ($idMarcas)";
            }else{
                $andmed_accumulated = 'and med_accumulated <= 80';
            }

            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql1 = "select to_char($sysdateInicio,'dd/mm/yyyy')  as datainicio,
                            to_char($sysdateFim,'dd/mm/yyyy') as datafim 
                        from dual";

            $stmt = $conn->prepare($sql1);
            $stmt->execute();
            $resultCount = $stmt->fetchAll();

            $sql = "select 
                            marcax as ds,
                            marcax as descricao,
                            rol,
                            0 decrol,
                            lb,
                            0 declb,
                            mb,
                            2 decmb,
                            qtde,
                            0 decqtde,
                            nf,
                            0 decnf,
                            cc,
                            0 deccc
                    from (select marca,
                                REPLACE(marca,'-',' ') as marcax,
                                rol,
                                lb,
                                mb,
                                qtde,
                                nf,
                                cc,
                                fr_rol,
                                sum(sum(fr_rol)) over (partition by id_empresa order by rol desc rows unbounded preceding) as med_accumulated  
                            from (select id_empresa, marca,
                                         rol,
                                         lb,
                                         mb,
                                         qtde,
                                         nf,
                                         cc,
                                          100*ratio_to_report((case when rol > 0 then rol end)) over (partition by id_empresa) fr_rol
                                    from (select 'REDE' id_empresa,
                                                m.descricao as marca, 

                                                sum(vi.rob) as rob,
                                                sum(vi.rol) as rol,
                                                sum(vi.custo) as cmv,
                                                sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                                round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                                sum(vi.qtde) as qtde,
                                                count(distinct vi.numero_nf) as nf,
                                                count(distinct vi.id_pessoa) as cc
                                            from pricing.vm_ie_ve_venda_item vi, 
                                                 ms.tb_item_categoria ic,
                                                 ms.tb_item i,
                                                 ms.tb_categoria c, 
                                                 ms.empresa em,
                                                 ms.tb_marca m 
                                            where vi.id_item = ic.id_item
                                            and vi.id_categoria = ic.id_categoria
                                            and vi.id_item = i.id_item
                                            and vi.id_categoria = c.id_categoria
                                            and vi.id_empresa = em.id_empresa
                                            and ic.id_marca = m.id_marca
                                            $andData
                                            $andEmpUteis
                                            $andMarca
                                            --and m.id_marca not in ()
                                            group by m.descricao))
                        group by id_empresa, marca, rol, lb, mb, qtde, nf, cc, fr_rol)
                    where 1=1
                    -- Remover esse filtro se utilizar o filtro de marca
                    $andmed_accumulated -- med_accumulated <= 80
                    order by med_accumulated asc
                    ";
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('rob', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $elementos = $hydrator->extract($row);

                $data[] = $elementos;

                // $data[] = [
                //             'x'=> (float)$elementos['rol'],
                //             'y'=> (float)$elementos['mb'],
                //             'z'=> (float)$elementos['cc'],
                //             'desc'=> $elementos['ds'],
                //             'descricao'=> $elementos['descricao']
                // ];
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        $objReturn = $this->getCallbackModel();
        $objReturn->referencia = array('incio'=> $resultCount[0]['DATAINICIO'],'fim'=> $resultCount[0]['DATAFIM']);

        return $objReturn; 
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
