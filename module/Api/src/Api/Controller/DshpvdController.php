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

class DshpvdController extends AbstractRestfulController
{
    
    /**
     * Construct
     */
    public function __construct()
    {
        
    }

    public function listartreepvdAction()
    {
        $data = array();
        
        try {

            $pNiveis = $this->params()->fromQuery('niveis',null);
            $lvs = json_decode($pNiveis);

            $pNode = $this->params()->fromQuery('node',null);
            $nodeArr = explode('|', $pNode);
            $nodeId = $nodeArr[0];

            if(count($nodeArr)>2){
                $nodeId = $nodeArr[count($nodeArr)-2];
            }

            $em = $this->getEntityManager();

            $lvs = ['REDE', 'EMPRESA', 'CURVA_NBS', 'MARCA'];
            $nodes = array();
            foreach($lvs as $k => $n){
                if($k === 0){
                    $nodes['root'] = array( $lvs[$k], $lvs[$k], "'".$lvs[$k]."'"."||'|'||ID_".$lvs[$k] );
                } else {
                    $cols = array();
                    for($i=0; $i < $k; $i++){
                        $cols[] = $lvs[$i];
                    }

                    $cols[] = $n;

                    $nodes[$lvs[$k-1]] = array(
                        implode(", ", $cols), 
                        $lvs[$k], 
                        ($nodeId === 'root' ? null : "'".$pNode."|'" ) ."||"."'".$lvs[$k]."'"."||'|'||ID_".$lvs[$k]
                    );
                }
            }
     
            $groupBy = $nodes[$nodeId][0];
            $groupDescription = $nodes[$nodeId][1];
            $groupId = $nodes[$nodeId][2];
            $groupAndWhere = "";

            for ($i=0; $i < count($nodeArr); $i++) {                 
                $groupAndWhere .= ($i % 2 == 0 && $nodeArr[$i] !== 'root' ? " and ID_".$nodeArr[$i]." = '".$nodeArr[$i+1] . "'" : "" );
            }
            
            $leaf = ( (count($lvs) === 1 || $nodeId === $lvs[count($lvs)-2]) ? "'true'" : "'false'" );
           
            $sql ="select *
                from (
                    select $groupId as id,
                           $groupDescription as grupo,
                           $leaf as leaf,
                           sum(vd_rol) as rol,
                           sum(vd_lb) as lb,
                           (case when sum(vd_lb) > 0 then round((sum(vd_lb)/suM(vd_rol))*100,2) end) as mb
                      from (
                          select 'REDE' as id_rede,
                                 'REDE' as rede,
                                 vi.id_empresa,
                                 e.apelido as empresa,
                                 trunc(vi.data_emissao,'MM') as data,
                                 ic.id_marca,
                                 m.descricao as marca,
                                 es.id_curva_abc as id_curva_nbs,
                                 es.id_curva_abc as curva_nbs,
                                 vi.qtde as vd_qtde,
                                 vi.rob_sem_desconto as vd_robx,
                                 vi.desconto as vd_desconto,
                                 vi.rob as vd_rob,
                                 vi.rol as vd_rol,
                                 vi.custo as vd_cmv,
                                 nvl(vi.rol,0)-nvl(vi.custo,0) as vd_lb
          
                            from pricing.ie_ve_venda_item vi,
                                 ms.empresa e,
                                 ms.tb_item_categoria ic,
                                 ms.tb_item i,
                                 ms.tb_categoria c,
                                 ms.tb_marca m,
                                 ms.tb_estoque es
                           where vi.id_empresa = e.id_empresa
                             and vi.id_item = ic.id_item
                             and vi.id_categoria = ic.id_categoria
                             and vi.id_item = i.id_item
                             and vi.id_categoria = c.id_categoria
                             and ic.id_marca = m.id_marca 
                             and vi.id_empresa = es.id_empresa
                             and vi.id_item = es.id_item
                             and vi.id_categoria = es.id_categoria
          
                             and trunc(vi.data_emissao,'MM') = '01/01/2020'
                             --and trunc(vi.data_emissao) >= trunc(add_months(sysdate,-12),'RRRR')
                             --and trunc(vi.data_emissao) <= trunc(sysdate-1)
                        )
                    where 1=1
                    $groupAndWhere
                    group by $groupBy, $groupId
                 )
            where 1=1";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
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

    public function listarEmpresasAction()
    {
        $data = array();
        
        try {

            $pNode = $this->params()->fromQuery('node',null);

            // $data = array();
            // $pkey = 'emp';
            // $data[] = [$pkey => 'AR'];
            // $data[] = [$pkey => 'AC'];
            // $data[] = [$pkey => 'RJ'];
            // $data[] = [$pkey => 'RA'];
            // $data[] = [$pkey => 'GO'];

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
            // $hydrator->addStrategy('qt_mes', new ValueStrategy);
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

    public function listarmarcaAction()
    {
        $data = array();

        $emp         = $this->params()->fromQuery('emp',null);

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
