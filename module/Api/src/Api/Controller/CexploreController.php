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

class CexploreController extends AbstractRestfulController
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

            $datainicioa      = $this->params()->fromQuery('datainicioa',null);
            $datafinala       = $this->params()->fromQuery('datafinala',null);
            $datainiciob      = $this->params()->fromQuery('datainiciob',null);
            $datafinalb       = $this->params()->fromQuery('datafinalb',null);
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
            if($datainicioa){
                $datainicioa = "'$datainicioa'";
            }else{
                $datainicioa = "'01/02/2021'";
            }
            if($datafinala){
                $datafinala = "'$datafinala'";
                $andSql = " and trunc(vi.data_emissao,'MM') <= $datafinala";
            }else{
                $datafinala = "'28/02/2021'";
                $andSql = " and trunc(vi.data_emissao,'MM') <= $datafinala";
            }
            
            if($datainiciob){
                $datainiciob = "'$datainiciob'";
                $andSql = "and trunc(vi.data_emissao,'MM') <= $datainiciob";
            }else{
                $datainiciob = "'01/02/2021'";
                $andSql = "and trunc(vi.data_emissao,'MM') <= $datainiciob";
            }
            if($datafinalb){
                $datafinalb = "'$datafinalb'";
            }else{
                $datafinalb = "'28/02/2021'";
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

            // var_dump($lvs);
            // exit;

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

                $orderBy = ' GRUPO';

                // foreach($arrayOrder as $linha){

                //     if($linha->ordem){
                //         if($linha->campo == $groupDescription){
                //             if($orderBy){
                //                 $orderBy .= ',GRUPO '.$linha->ordem;
                //             }else{
                //                 $orderBy = 'GRUPO '.$linha->ordem;
                //             }
                //         }else{
    
                //             $SemOrder = false;
                //             foreach($lvs as $idGrupo){
                //                 if($linha->campo == $idGrupo){
                //                     $SemOrder = true;
                //                 }
                //             }
                //             // if(!$SemOrder){
                //             //     if($orderBy){
                //             //         $orderBy .= ', '.$linha->campo.' '.$linha->ordem;
                //             //     }else{
                //             //         $orderBy = ' '.$linha->campo.' '.$linha->ordem;
                //             //     }
                //             // }
                            
                //         }
                //     }
                // }
            }

            
            // var_dump($arrayOrder);
            // exit;
            
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

            $sql = "select id,
                         grupo,
                         leaf,
                         preco_medioa preco_medio, preco_mediob, round(100*(preco_mediob/preco_medioa-1),2) as preco_mediox,
                         mba mb, mbb, round(100*(mbb/mba-1),2) as mbx,
                         roba rob, robb, round(100*(robb/roba-1),2) as robx,
                         qtdea qtde, qtdeb, round(100*(qtdeb/qtdea-1),2) as qtdex,
                         rola rol, rolb, round(100*(rolb/rola-1),2) as rolx,
                         cmva cmv, cmvb, round(100*(cmvb/cmva-1),2) as cmvx,
                         lba lb, lbb, round(100*(lbb/lba-1),2) as lbx
                    from (
                        select $groupId as id,
                            $groupDescription as grupo,
                            $leaf as leaf,
                            
                            round(sum(case when data >= '01/01/2021' and data <= '31/01/2021' then rob end)/sum(case when data >= '01/01/2021' and data <= '31/01/2021' then qtde end),2) as preco_medioa,
                            round((case when sum(case when data >= '01/01/2021' and data <= '31/01/2021' then qtde end) > 0 then (sum(nvl(case when data >= '01/01/2021' and data <= '31/01/2021' then rol end,0)-nvl(case when data >= '01/01/2021' and data <= '31/01/2021' then cmv end,0))/sum(case when data >= '01/01/2021' and data <= '31/01/2021' then rol end))*100 end),2) as mba,
                            sum(case when data >= '01/01/2021' and data <= '31/01/2021' then rob end) as roba,
                            sum(case when data >= '01/01/2021' and data <= '31/01/2021' then qtde end) as qtdea,
                            sum(case when data >= '01/01/2021' and data <= '31/01/2021' then rol end) as rola,
                            sum(case when data >= '01/01/2021' and data <= '31/01/2021' then cmv end) as cmva,
                            sum(case when data >= '01/01/2021' and data <= '31/01/2021' then lb end) as lba,
                            
                            round(sum(case when data >= $datainicioa and data <= $datafinala then rob end)/sum(case when data >= $datainicioa and data <= $datafinala then qtde end),2) as preco_mediob,
                            round((case when sum(case when data >= $datainicioa and data <= $datafinala then qtde end) > 0 then (sum(nvl(case when data >= $datainicioa and data <= $datafinala then rol end,0)-nvl(case when data >= $datainicioa and data <= $datafinala then cmv end,0))/sum(case when data >= $datainicioa and data <= $datafinala then rol end))*100 end),2) as mbb,
                            sum(case when data >= $datainicioa and data <= $datafinala then rob end) as robb,
                            sum(case when data >= $datainicioa and data <= $datafinala then qtde end) as qtdeb,
                            sum(case when data >= $datainicioa and data <= $datafinala then rol end) as rolb,
                            sum(case when data >= $datainicioa and data <= $datafinala then cmv end) as cmvb,
                            sum(case when data >= $datainicioa and data <= $datafinala then lb end) as lbb
                            
                        from (select 'REDE' as id_rede, 'REDE' as rede, vi.id_empresa, em.apelido as empresa, ic.id_marca, m.descricao as marca, nvl(mg.gestor,'G5 N/D') id_gestor, nvl(mg.gestor,'G5 N/D') as gestor,
                                    --vi.id_empresa, em.apelido as empresa, ic.id_marca, m.descricao as marca, 
                                    trunc(vi.data_emissao,'MM') as data,
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
                                    ms.tb_marca m,
                                    pricing.tb_marca_gestor mg
                                where vi.id_item = ic.id_item
                                and vi.id_categoria = ic.id_categoria
                                and vi.id_item = i.id_item
                                and vi.id_categoria = c.id_categoria
                                and vi.id_empresa = em.id_empresa
                                and ic.id_marca = m.id_marca
                                and ic.id_marca = mg.id_marca(+)
                                and vi.id_operacao in (4,7)
                                and vi.status_venda = 'A'
                                $andSql
                                -- Data inicial B
                                and trunc(vi.data_emissao,'MM') >= '01/01/2021'
                                -- Data final A
                                and trunc(vi.data_emissao,'MM') <= $datafinala
                                --and i.cod_item||c.descricao = 'JS00506.0'
                            group by trunc(vi.data_emissao,'MM'), vi.id_empresa, em.apelido, ic.id_marca, m.descricao, mg.gestor)
                        where 1=1
                        $groupAndWhere
                        group by $groupBy, $groupId)
                    where 1=1
                    $orderBy";

        //   print "$sql";
        //   exit;
            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('preco_medio', new ValueStrategy);
            $hydrator->addStrategy('preco_mediob', new ValueStrategy);
            $hydrator->addStrategy('preco_mediox', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('mbb', new ValueStrategy);
            $hydrator->addStrategy('mbx', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('qtdeb', new ValueStrategy);
            $hydrator->addStrategy('qtdex', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('rolb', new ValueStrategy);
            $hydrator->addStrategy('rolx', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('cmvb', new ValueStrategy);
            $hydrator->addStrategy('cmvx', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('lbb', new ValueStrategy);
            $hydrator->addStrategy('lbx', new ValueStrategy);
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

    

    public function listargrupomarcaAction(){
        // return array idEmpresas

        $marcas = array();

        $marcas[] = ['id'=> 'G1 EVERTONOPE','idMarcas'=> [181,99,10146,300,542,584,341,1013,10388,538,342,10176,567,289,10396,70,10353,
        131,10174,604,211,10143,10021,620,267,10295,10187,10352,89,594,10206,9999,10165,10355,92,
        113,104,261,140,10184,10112,121,83]];

        $marcas[] = ['id'=> 'G2 MAYKONRS','idMarcas'=> [39,10426,10307,10407,10406,106,270,8,7,10102,
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
        570,10379,178,87,204,586,309,10297,10149,10292,310,10164,118,10268,10185,1014,216,10177,69,
        10348,225,569,10169,10155,1000,336,26,10099,266,559,10166,568,337,15,10018,572,10245,10251,10142,298,132,587,
        10329,10175,323,10118,248,251,540,100559,147,10354,2,10236,10326,10376,580,598,602,10103,10020,334,77,175,64,100,10418,
        566,330,235,200,
        304,10237,10192,13,612,10301,290,10293,10131,169,115,143,553,10274,10235,10441,10400,10319,10196,
        146,282,314,10104,10316,10302,10244,10013,10413,10373,10107,346,10153,10345,335
        ]];

        $this->setCallbackData($marcas);
        return $this->getCallbackModel();
    }

    // public function listarcurvaAction()
    // {
    //     $data = array();
        
    //     try {
    //         $session = $this->getSession();
    //         $usuario = $session['info']['usuarioSistema'];

    //         // $idEmpresa      = $this->params()->fromQuery('idEmpresa',null);

    //         $em = $this->getEntityManager();
    //         $conn = $em->getConnection();

    //         $sql = "select id_curva_abc from MS.TB_CURVA_ABC";

    //         $stmt = $conn->prepare($sql);
    //         // $stmt->bindParam(':idEmpresa', $idEmpresa);
    //         $stmt->execute();
    //         $results = $stmt->fetchAll();

    //         $hydrator = new ObjectProperty;
    //         $hydrator->addStrategy('id_curva_abc', new ValueStrategy);
    //         $stdClass = new StdClass;
    //         $resultSet = new HydratingResultSet($hydrator, $stdClass);
    //         $resultSet->initialize($results);

    //         $data = array();
    //         foreach ($resultSet as $row) {
    //             $data[] = $hydrator->extract($row);
    //         }

    //         $this->setCallbackData($data);
    //         $this->setMessage("Solicitação enviada com sucesso.");
            
    //     } catch (\Exception $e) {
    //         $this->setCallbackError($e->getMessage());
    //     }
        
    //     return $this->getCallbackModel();
    // }

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
            // $data[] = [$pkey => 'CURVA_NBS'];
            $data[] = [$pkey => 'MARCA'];
            $data[] = [$pkey => 'GESTOR'];

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
            $data[] = ['campo' => 'GESTOR', 'ordem' => 'ASC'];

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
