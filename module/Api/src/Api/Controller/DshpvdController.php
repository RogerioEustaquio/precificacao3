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

            $data       = $this->params()->fromQuery('data',null);
            $emps       = $this->params()->fromQuery('emps',null);
            $marcas     = $this->params()->fromQuery('marcas',null);
            $curvas     = $this->params()->fromQuery('curvas',null);
            $produtos   = $this->params()->fromQuery('produtos',null);

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
                $andSql = " and trunc(vi.data_emissao,'MM') = '01/'||to_char(sysdate,'mm/yyyy')";
                $andData = 'sysdate';
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
                $lvs = ['REDE', 'EMPRESA', 'CURVA_NBS', 'MARCA'];
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
                           null as lb,
                           sum(vd_qtde) as qtde,
                           (case when sum(vd_desconto) > 0 then round((sum(vd_desconto)/suM(vd_robx))*100,2) end) as p_desconto,
                           (case when sum(vd_lb) > 0 then round((sum(vd_lb)/suM(vd_rol))*100,2) end) as mb,
                           (case when sum(vd_robx) > 0 then round((sum(vd_robx)/sum(vd_qtde))*100,2) end) as pvm,
                           (case when sum(vd_cmv) > 0 then round((sum(vd_cmv)/sum(vd_qtde))*100,2) end) as pcm,
                           sum(vd_rol_1m) as rol_1m,
                           sum(vd_lb_1m) as lb_1m,
                           sum(vd_qtde_1m) as qtde_1m,
                           (case when sum(vd_desconto_1m) > 0 then round((sum(vd_desconto_1m)/suM(vd_robx_1m))*100,2) end) as p_desconto_1m,
                           (case when sum(vd_lb_1m) > 0 then round((sum(vd_lb_1m)/suM(vd_rol_1m))*100,2) end) as mb_1m,
                           (case when sum(vd_robx_1m) > 0 then round((sum(vd_robx_1m)/sum(vd_qtde_1m))*100,2) end) as pvm_1m,
                           (case when sum(vd_cmv_1m) > 0 then round((sum(vd_cmv_1m)/sum(vd_qtde_1m))*100,2) end) as pcm_1m,
                           sum(vd_rol_1a) as rol_1a,
                           sum(vd_lb_1a) as lb_1a,
                           sum(vd_qtde_1a) as qtde_1a,
                           (case when sum(vd_desconto_1a) > 0 then round((sum(vd_desconto_1a)/suM(vd_robx_1a))*100,2) end) as p_desconto_1a,
                           (case when sum(vd_lb_1a) > 0 then round((sum(vd_lb_1a)/suM(vd_rol_1a))*100,2) end) as mb_1a,
                           (case when sum(vd_robx_1a) > 0 then round((sum(vd_robx_1a)/sum(vd_qtde_1a))*100,2) end) as pvm_1a,
                           (case when sum(vd_cmv_1a) > 0 then round((sum(vd_cmv_1a)/sum(vd_qtde_1a))*100,2) end) as pcm_1a,
                           sum(vd_rol_ac) as rol_ac,
                           sum(vd_lb_ac) as lb_ac,
                           sum(vd_qtde_ac) as qtde_ac,
                           (case when sum(vd_desconto_ac) > 0 then round((sum(vd_desconto_ac)/suM(vd_robx_ac))*100,2) end) as p_desconto_ac,
                           (case when sum(vd_lb_ac) > 0 then round((sum(vd_lb_ac)/suM(vd_rol_ac))*100,2) end) as mb_ac,
                           (case when sum(vd_robx_ac) > 0 then round((sum(vd_robx_ac)/sum(vd_qtde_ac))*100,2) end) as pvm_ac,
                           (case when sum(vd_cmv_ac) > 0 then round((sum(vd_cmv_ac)/sum(vd_qtde_ac))*100,2) end) as pcm_ac
                        from (
                                select 'REDE' as id_rede, 'REDE' as rede, a.id_empresa, a.empresa, a.id_marca, a.marca, a.id_curva_nbs, a.curva_nbs,
                                    a.vd_qtde, a.vd_robx, a.vd_desconto, a.vd_rob, a.vd_rol, a.vd_cmv, a.vd_lb,
                                    b.vd_qtde_1m, b.vd_robx_1m, b.vd_desconto_1m, b.vd_rob_1m, b.vd_rol_1m, b.vd_cmv_1m, b.vd_lb_1m,
                                    c.vd_qtde_1a, c.vd_robx_1a, c.vd_desconto_1a, c.vd_rob_1a, c.vd_rol_1a, c.vd_cmv_1a, c.vd_lb_1a,
                                    d.vd_qtde_ac, d.vd_robx_ac, d.vd_desconto_ac, d.vd_rob_ac, d.vd_rol_ac, d.vd_cmv_ac, d.vd_lb_ac
                                from (select vi.id_empresa, vi.id_item, vi.id_categoria, e.apelido as empresa, ic.id_marca, m.descricao as marca, 
                                            es.id_curva_abc as id_curva_nbs, es.id_curva_abc as curva_nbs,
                                            sum(vi.qtde) as vd_qtde,
                                            sum(vi.rob_sem_desconto) as vd_robx,
                                            sum(vi.desconto) as vd_desconto,
                                            sum(vi.rob) as vd_rob,
                                            sum(vi.rol) as vd_rol,
                                            sum(vi.custo) as vd_cmv,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as vd_lb
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
                                        --and trunc(vi.data_emissao,'MM') = '01/10/2020'
                                        --and i.cod_item = 'JS00506'
                                        $andSql
                                        group by vi.id_empresa, vi.id_item, vi.id_categoria, e.apelido, ic.id_marca, m.descricao, es.id_curva_abc) a,
                                        (select vi.id_empresa, vi.id_item, vi.id_categoria,
                                            sum(vi.qtde) as vd_qtde_1m,
                                            sum(vi.rob_sem_desconto) as vd_robx_1m,
                                            sum(vi.desconto) as vd_desconto_1m,
                                            sum(vi.rob) as vd_rob_1m,
                                            sum(vi.rol) as vd_rol_1m,
                                            sum(vi.custo) as vd_cmv_1m,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as vd_lb_1m
                                        from pricing.ie_ve_venda_item vi
                                        where trunc(vi.data_emissao,'MM') = add_months($andData,-1)
                                        group by vi.id_empresa, vi.id_item, vi.id_categoria) b,
                                        (select vi.id_empresa, vi.id_item, vi.id_categoria,
                                            sum(vi.qtde) as vd_qtde_1a,
                                            sum(vi.rob_sem_desconto) as vd_robx_1a,
                                            sum(vi.desconto) as vd_desconto_1a,
                                            sum(vi.rob) as vd_rob_1a,
                                            sum(vi.rol) as vd_rol_1a,
                                            sum(vi.custo) as vd_cmv_1a,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as vd_lb_1a
                                        from pricing.ie_ve_venda_item vi
                                        where trunc(vi.data_emissao,'MM') = add_months($andData,-12)
                                        group by vi.id_empresa, vi.id_item, vi.id_categoria) c,
                                        (select vi.id_empresa, vi.id_item, vi.id_categoria,
                                            sum(vi.qtde) as vd_qtde_ac,
                                            sum(vi.rob_sem_desconto) as vd_robx_ac,
                                            sum(vi.desconto) as vd_desconto_ac,
                                            sum(vi.rob) as vd_rob_ac,
                                            sum(vi.rol) as vd_rol_ac,
                                            sum(vi.custo) as vd_cmv_ac,
                                            sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as vd_lb_ac
                                        from pricing.ie_ve_venda_item vi
                                        --where trunc(vi.data_emissao,'RRRR') = trunc(to_date($andData, 'DD/MM/RRRR'),'RRRR')
                                        --and trunc(vi.data_emissao,'MM') < trunc(to_date($andData, 'DD/MM/RRRR'),'MM')
                                        group by vi.id_empresa, vi.id_item, vi.id_categoria) d
                                where a.id_empresa = b.id_empresa(+)
                                and a.id_item = b.id_item(+)
                                and a.id_categoria = b.id_categoria(+)
                                and a.id_empresa = c.id_empresa(+)
                                and a.id_item = c.id_item(+)
                                and a.id_categoria = c.id_categoria(+)
                                and a.id_empresa = d.id_empresa(+)
                                and a.id_item = d.id_item(+)
                                and a.id_categoria = d.id_categoria(+))
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
            $hydrator->addStrategy('rol_1m', new ValueStrategy);
            $hydrator->addStrategy('rol_1a', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('lb_1m', new ValueStrategy);
            $hydrator->addStrategy('lb_1a', new ValueStrategy);
            $hydrator->addStrategy('p_desconto', new ValueStrategy);
            $hydrator->addStrategy('p_desconto_1m', new ValueStrategy);
            $hydrator->addStrategy('p_desconto_1a', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('mb_1m', new ValueStrategy);
            $hydrator->addStrategy('mb_1a', new ValueStrategy);
            $hydrator->addStrategy('pvm', new ValueStrategy);
            $hydrator->addStrategy('pvm_1m', new ValueStrategy);
            $hydrator->addStrategy('pvm_1a', new ValueStrategy);
            $hydrator->addStrategy('pcm', new ValueStrategy);
            $hydrator->addStrategy('pcm_1m', new ValueStrategy);
            $hydrator->addStrategy('pcm_1a', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            foreach ($resultSet as $row) {

                $l = $hydrator->extract($row);

                $l['rol_x_1m'] = ($l['rol'] && $l['rol_1m'] ? (($l['rol']/$l['rol_1m'])-1)*100 : null);
                $l['rol_x_1a'] = ($l['rol'] && $l['rol_1a'] ? (($l['rol']/$l['rol_1a'])-1)*100 : null);

                $l['lb_x_1m'] = ($l['lb'] && $l['lb_1m'] ? (($l['lb']/$l['lb_1m'])-1)*100 : null);
                $l['lb_x_1a'] = ($l['lb'] && $l['lb_1a'] ? (($l['lb']/$l['lb_1a'])-1)*100 : null);

                $l['pDesconto_x_1m'] = ($l['pDesconto'] && $l['pDesconto_1m'] ? (($l['pDesconto']/$l['pDesconto_1m'])-1)*100 : null);
                $l['pDesconto_x_1a'] = ($l['pDesconto'] && $l['pDesconto_1a'] ? (($l['pDesconto']/$l['pDesconto_1a'])-1)*100 : null);

                $l['mb_x_1m'] = ($l['mb'] && $l['mb_1m']? (($l['mb']/$l['mb_1m'])-1)*100 : null);
                $l['mb_x_1a'] = ($l['mb'] && $l['mb_1a'] ? (($l['mb']/$l['mb_1a'])-1)*100 : null);

                $l['pvm_x_1m'] = ($l['pvm'] && $l['pvm_1m']? (($l['pvm']/$l['pvm_1m'])-1)*100 : null);
                $l['pvm_x_1a'] = ($l['pvm'] && $l['pvm_1a'] ? (($l['pvm']/$l['pvm_1a'])-1)*100 : null);

                $l['pcm_x_1m'] = ($l['pcm'] && $l['pcm_1m']? (($l['pcm']/$l['pcm_1m'])-1)*100 : null);
                $l['pcm_x_1a'] = ($l['pcm'] && $l['pcm_1a'] ? (($l['pcm']/$l['pcm_1a'])-1)*100 : null);

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

    public function listarprodutosAction()
    {   
        $data = array();
        
        try {

            $pEmp = $this->params()->fromQuery('emp',null);
            $pCod = $this->params()->fromQuery('codItem',null);

            if(!$pCod){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();
            
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
                    and i.cod_item||c.descricao like upper('$pCod%')
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
