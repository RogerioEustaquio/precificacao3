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

class PriceController extends AbstractRestfulController
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

            $data       = $this->params()->fromQuery('data',null);
            $emps       = $this->params()->fromQuery('emps',null);
            $marcas     = $this->params()->fromQuery('marcas',null);
            $curvas     = $this->params()->fromQuery('curvas',null);
            $produtos   = $this->params()->fromQuery('produtos',null);
            $ordem      = $this->params()->fromQuery('ordem',null);

            if($ordem){
                $arrayOrder = json_decode($ordem);
            }

            if($emps){
                $emps   =  implode(",",json_decode($emps));
            }
            if($marcas){
                $marcas =  implode(",",json_decode($marcas));
            }
            if($curvas){
                $curvas =  implode("','",json_decode($curvas));
            }
            if($produtos){
                $produtos =  implode("','",json_decode($produtos));
            }

            $andSql = '';
            if($data){
                $andSql = " and trunc(vi.data_emissao,'MM') = '01/$data'";
                $andData = "'01/$data'";
            }else{
                $andSql = " and trunc(vi.data_emissao,'MM') = '01/'||to_char(add_months(trunc(sysdate,'MM'),-1),'mm/yyyy')";
                $andData = "'01/'||to_char(add_months(trunc(sysdate,'MM'),-1),'mm/yyyy')";
            }

            if($emps){
                $andSql .= " and vi.id_empresa in ($emps)";
            }

            if($marcas){
                $andSql .= " and ic.id_marca in ($marcas)";
            }

            if($curvas){
                $andSql .= " and es.id_curva_abc in ('$curvas')";
            }

            if($produtos){
                $andSql .= " and i.cod_item||c.descricao in ('$produtos')";
            }

            $pNiveis = $this->params()->fromQuery('niveis',null);
            $lvs = json_decode($pNiveis);

            $pNode = $this->params()->fromQuery('node',null);
            $nodeArr = explode('|', $pNode);
            $nodeId = $nodeArr[0];

            if(count($nodeArr)>2){
                $nodeId = $nodeArr[count($nodeArr)-2];
            }

            $em = $this->getEntityManager();

            if(!$lvs){
                $lvs = ['REDE', 'MARCA', 'EMPRESA'];
            }
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

            //loop order by//
            $orderBy = '';
            if($arrayOrder){

                foreach($arrayOrder as $linha){

                    if($linha->ordem){
                        if($linha->campo == $groupDescription){
                            if($orderBy){
                                $orderBy .= ',GRUPO '.$linha->ordem;
                            }else{
                                $orderBy = 'GRUPO '.$linha->ordem;
                            }
                        }else{
    
                            $SemOrder = false;
                            foreach($lvs as $idGrupo){
                                if($linha->campo == $idGrupo){
                                    $SemOrder = true;
                                }
                            }
                            if(!$SemOrder){
                                if($orderBy){
                                    $orderBy .= ', '.$linha->campo.' '.$linha->ordem;
                                }else{
                                    $orderBy = ' '.$linha->campo.' '.$linha->ordem;
                                }
                            }
                            
                        }
                    }
                }
            }
            
            if($orderBy){
                $orderBy = 'order by '.$orderBy;
            }else{
                $orderBy = 'order by GRUPO';
            }
            // Fim order by

            for ($i=0; $i < count($nodeArr); $i++) {                 
                $groupAndWhere .= ($i % 2 == 0 && $nodeArr[$i] !== 'root' ? " and ID_".$nodeArr[$i]." = '".$nodeArr[$i+1] . "'" : "" );
            }
            
            $leaf = ( (count($lvs) === 1 || $nodeId === $lvs[count($lvs)-2]) ? "'true'" : "'false'" );

            $sql ="select *
            from (
            select $groupId as id,
                   $groupDescription as grupo,
                   $leaf as leaf,
                   round(sum(rob)/sum(qtde),2) as preco_medio,
                   round((case when sum(qtde) > 0 then (sum(nvl(rol,0)-nvl(cmv,0))/sum(rol))*100 end),2) as mb,
                   sum(rob) as rob,
                   sum(qtde) as qtde,
                   sum(rol) as rol,
                   sum(cmv) as cmv,
                   sum(lb) as lb
              from (select 'REDE' as id_rede, 'REDE' as rede, vi.id_empresa, em.apelido as empresa, ic.id_marca, m.descricao as marca, 
                           --round(sum(vi.rob)/sum(vi.qtde),2) as preco_medio,
                           --round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                           sum(vi.rob) as rob,
                           sum(vi.qtde) as qtde,
                           sum(vi.rol) as rol,
                           sum(vi.custo) as cmv,
                           sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb
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
                       and vi.id_operacao in (4,7)
                       and vi.status_venda = 'A'
                       $andSql
                       --and i.cod_item||c.descricao = 'JS00506.0'
                       --and trunc(vi.data_emissao) >= '01/03/2021'
                       --and trunc(vi.data_emissao) <= '12/03/2021'
                     group by vi.id_empresa, em.apelido, ic.id_marca, m.descricao)
            where 1=1
            $groupAndWhere
            group by $groupBy, $groupId)
          where 1=1
          $orderBy";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('preco_medio', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {

                $l = $hydrator->extract($row);

                $data[] = $l;
            }

            // var_dump($data);
            // exit;

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

    public function listarcurvaAction()
    {
        $data = array();
        
        try {
            $session = $this->getSession();
            $usuario = $session['info']['usuarioSistema'];

            // $idEmpresa      = $this->params()->fromQuery('idEmpresa',null);

            $em = $this->getEntityManager();
            $conn = $em->getConnection();

            $sql = "select id_curva_abc from MS.TB_CURVA_ABC";

            $stmt = $conn->prepare($sql);
            // $stmt->bindParam(':idEmpresa', $idEmpresa);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('id_curva_abc', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);
            }

            $this->setCallbackData($data);
            $this->setMessage("Solicitação enviada com sucesso.");
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarElementosAction()
    {
        $data = array();
        
        try {

            $pNode = $this->params()->fromQuery('node',null);
            // $lvs = ['REDE', 'EMPRESA', 'CURVA_NBS', 'MARCA'];
            $data = array();
            $pkey = 'idKey';
            $data[] = [$pkey => 'REDE'];
            $data[] = [$pkey => 'EMPRESA'];
            $data[] = [$pkey => 'CURVA_NBS'];
            $data[] = [$pkey => 'MARCA'];

            $this->setCallbackData($data);

            $objReturn = $this->getCallbackModel();
            
        } catch (\Exception $e) {
            $objReturn = $this->setCallbackError($e->getMessage());
        }
        
        return $objReturn;
    }

    public function listarordemagrupamentoAction()
    {
        $data = array();
        
        try {

            $pNode = $this->params()->fromQuery('node',null);
            // $lvs = ['REDE', 'EMPRESA', 'CURVA_NBS', 'MARCA'];
            $data = array();
            $data[] = ['campo' => 'REDE', 'ordem' => 'ASC'];
            $data[] = ['campo' => 'EMPRESA', 'ordem' => 'ASC'];
            // $data[] = ['campo' => 'CURVA_NBS', 'ordem' => 'ASC'];
            $data[] = ['campo' => 'MARCA', 'ordem' => 'ASC'];
            // $data[] = ['campo' => 'GRUPO', 'ordem' => 'ASC'];
            // $data[] = ['campo' => 'ROL', 'ordem' => 'DESC'];

            $this->setCallbackData($data);

            $objReturn = $this->getCallbackModel();
            
        } catch (\Exception $e) {
            $objReturn = $this->setCallbackError($e->getMessage());
        }
        
        return $objReturn;
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
    
}
