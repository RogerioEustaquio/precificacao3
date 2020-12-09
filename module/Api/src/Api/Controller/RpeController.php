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

            $em = $this->getEntityManager();

            
            $sql = "select marca,
       
            dias_uteis_m0, -- Dias úteis atual
            dias_uteis_m1, -- Dias úteis mês anterior
            dias_uteis_3m, -- Dias úteis 3 meses
            dias_uteis_6m, -- Dias úteis 6 meses
            dias_uteis_12m, -- Dias úteis 12 meses
     
            rol_dia_m0, -- ROL Dia Atual
            rol_dia_m1, -- ROL Dia mês anterior
            rol_dia_3m, -- ROL Dia 3 meses
            rol_dia_6m, -- ROL Dia 6 meses
            rol_dia_12m, -- ROL Dia 12 meses

            round(100*(rol_dia_m0/rol_dia_m1-1),2) as rol_dia_m0_x_1m, -- ROL Dia Atual x Mês Anterior,
            round(100*(rol_dia_m0/rol_dia_3m-1),2) as rol_dia_m0_x_3m, -- ROL Dia Atual x 3 Meses,
            round(100*(rol_dia_m0/rol_dia_6m-1),2) as rol_dia_m0_x_6m, -- ROL Dia Atual x 6 Meses,
            round(100*(rol_dia_m0/rol_dia_12m-1),2) as rol_dia_m0_x_12m, -- ROL Dia Atual x 12 Meses,
            
            estoque_valor -- Valor de Estoque  
       from (select a.marca,
            
                    (case when rol_m0 > 0 then rol_m0/dias_uteis_m0 end) as rol_dia_m0,
                    (case when rol_m1 > 0 then rol_m1/dias_uteis_m1 end) as rol_dia_m1,    
                    (case when rol_3m > 0 then rol_3m/dias_uteis_3m end) as rol_dia_3m, 
                    (case when rol_6m > 0 then rol_6m/dias_uteis_6m end) as rol_dia_6m,
                    (case when rol_12m > 0 then rol_12m/dias_uteis_12m end) as rol_dia_12m,
                    dias_uteis_m0,
                    dias_uteis_m1,
                    dias_uteis_3m,
                    dias_uteis_6m,
                    dias_uteis_12m,
                    a.estoque_valor -- Valor de Estoque  
               from (select ic.id_marca, m.descricao as marca, sum(e.estoque*e.custo_contabil) as estoque_valor
                       from ms.tb_estoque e, ms.tb_item_categoria ic, ms.tb_marca m
                      where e.id_item = ic.id_item
                        and e.id_categoria = ic.id_categoria
                        and ic.id_marca = m.id_marca
                      group by ic.id_marca, m.descricao) a,
                     (select xv.id_marca,
                             sum(case when xv.data = trunc(sysdate,'MM') then xv.rol end) as rol_m0,
                             sum(case when xv.data = add_months(trunc(sysdate,'MM'),-1) then xv.rol end) as rol_m1,
                             sum(case when xv.data > add_months(trunc(sysdate,'MM'),-3) and xv.data < trunc(sysdate,'MM') then xv.rol end) as rol_3m,
                             sum(case when xv.data > add_months(trunc(sysdate,'MM'),-6) and xv.data < trunc(sysdate,'MM') then xv.rol end) as rol_6m,
                             sum(case when xv.data > add_months(trunc(sysdate,'MM'),-12) and xv.data < trunc(sysdate,'MM') then xv.rol end) as rol_12m,
                             
                             sum(case when xd.data = trunc(sysdate,'MM') then xd.dias_uteis end) as dias_uteis_m0,
                             sum(case when xd.data = add_months(trunc(sysdate,'MM'),-1) then xd.dias_uteis end) as dias_uteis_m1,
                             sum(case when xd.data > add_months(trunc(sysdate,'MM'),-3) and xd.data < trunc(sysdate,'MM') then xd.dias_uteis end) as dias_uteis_3m,
                             sum(case when xd.data > add_months(trunc(sysdate,'MM'),-6) and xd.data < trunc(sysdate,'MM') then xd.dias_uteis end) as dias_uteis_6m,
                             sum(case when xd.data > add_months(trunc(sysdate,'MM'),-12) and xd.data < trunc(sysdate,'MM') then xd.dias_uteis end) as dias_uteis_12m
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
                               
                               and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'), -13)
     
                             group by trunc(vi.data_emissao, 'MM'), ic.id_marca) xv,
                             
                           (select MES AS DATA, DECODE(MES,'01/05/2019',DIAS_UTEIS+0.33,DIAS_UTEIS) AS DIAS_UTEIS
                              from PRICING.VW_DIAS_UTEIS
                             where EMP = 'REDE'
                               and mes >= add_months(trunc(sysdate,'MM'), -13) ) xd
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
            $hydrator->addStrategy('rol_dia_m0', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m1', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_3m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_6m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_12m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_1m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_3m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_6m', new ValueStrategy);
            $hydrator->addStrategy('rol_dia_m0_x_12m', new ValueStrategy);
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
    
}
