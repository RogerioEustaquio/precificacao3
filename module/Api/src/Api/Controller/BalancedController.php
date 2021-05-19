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

class BalancedController extends AbstractRestfulController
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

    private function create_data($data){

        $ObjDate = date_create();
        $dia = (float) substr($data,0,2);
        $mes = (float) substr($data,3,2);
        $ano = (float) substr($data,6,4);

        $ObjDate->setDate( $ano, $mes, $dia); // Ou date_date_set($ObjDate, $ano, $mes, $dia); 
        $timeEmissao = date_timestamp_get($ObjDate);

        return $timeEmissao ;
    }

    public function listaritensbalancedAction()
    {
        $data = array();
        
        try {

            $marca      = $this->params()->fromPost('marca',null); //Ex: 130,128,131,129,146,136
            $filial     = $this->params()->fromPost('filial',null);
            $datainicio = $this->params()->fromPost('datainicio',null);
            $datafim    = $this->params()->fromPost('datafim',null);
            $produtos   = $this->params()->fromPost('produtos',null);
            $periodo    = $this->params()->fromPost('periodo',null);

            $sqlData = '';
            $andSql = '';

            if($marca){
                $marca = implode(",",json_decode($marca));
            }
            if($marca){
                $andSql .= " and ic.id_marca in ($marca)";
            }

            if($filial){
                $filial = implode(",",json_decode($filial));
            }
            $andFilial ='';
            if($filial){
                $andFilial = " and vi.id_empresa in ($filial)";
            }

            $andData = '';
            if($datainicio){
                $andData = "and trunc(vi.data_emissao) >= to_date('".$datainicio."')";
            }else{
                $andData =  "and trunc(vi.data_emissao) >= to_date('01/01/|| to_char(sysdate,'yyyy'))";
            }
            if($datafim){
                $andData .= " and trunc(vi.data_emissao) <= to_date('".$datafim."')";
            }

            if(!$datainicio && !$datafim){
                $andData = "and trunc(vi.data_emissao) >= to_date('01/01/'|| to_char(sysdate,'yyyy'))";
            }

            if($periodo == 'M'){
                $sqlData = "to_date(to_char(trunc(vi.data_emissao,'MM'),'dd/mm/yyyy'))";
                // $andSql .=  "and trunc(vi.data_emissao) >= to_date('01/01/|| to_char(sysdate,'yyyy'))";
            }else{
                $sqlData = "to_date(to_char(trunc(vi.data_emissao,'DD'),'dd/mm/yyyy'))";
                // $andSql .= "and trunc(vi.data_emissao) >= to_date('01/01/'|| to_char(sysdate,'yyyy'))";
            }

            if($produtos){
                $andSql .= " and i.cod_item||c.descricao in ('$produtos')";
            }

            $em = $this->getEntityManager();
            
            $sql = "select $sqlData as data,
                            round(sum(vi.rob)/sum(vi.qtde),2) as preco_medio,
                            sum(vi.rol) as rol,
                            --sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                            round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                            sum(vi.qtde) as qtde,
                            count(distinct vi.numero_nf) as nf
                            --count(distinct vi.id_pessoa) as cc
                    from pricing.vm_ie_ve_venda_item vi,
                         ms.tb_item_categoria ic,
                         ms.tb_item i,
                         ms.tb_categoria c
                    where vi.id_item = ic.id_item
                    and vi.id_categoria = ic.id_categoria
                    and vi.id_item = i.id_item
                    and vi.id_categoria = c.id_categoria
                    and vi.id_operacao in (4,7)
                    and vi.status_venda = 'A'
                    --and i.cod_item||c.descricao = 'JS00506.0'
                    --and trunc(vi.data_emissao) >= '01/03/2021'
                    --and trunc(vi.data_emissao) <= '12/03/2021'
                    $andData
                    $andFilial
                    $andSql
                    group by $sqlData
                    order by 1 asc";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('data', new ValueStrategy);
            $hydrator->addStrategy('preco_medio', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data1 = array();
            $data2 = array();
            $data3 = array();
            $data4 = array();
            $data5 = array();
            $data = array();
            $categories= array();
            // $date = date_create();

            foreach ($resultSet as $row) {
                 
                $elementos = $hydrator->extract($row);
                $dataEmissao = $elementos['data'];
                // $date = date_create($dataEmissao);
                // $date->date = new dataTime();
                // $date->date = date_format($date, 'Y-d-m H:i:s.sss');
                $timeEmissao = $this->create_data($dataEmissao);
                // var_dump($date);
                // exit;

                // $timeEmissao = date_timestamp_get($date);
                // $timeEmissao = $date->getTimestamp();
                
                $elementos['data'] = $timeEmissao .'000';

                $data1[] = array(
                    'name'=> 'Preço Médio',
                    'type'=> 'line',
                    'data'=> $dataEmissao,
                    // 'description'=> $dataEmissao,
                    'x'=> (float) $elementos['data'],
                    'y'=> (float) $elementos['precoMedio'],
                    'show' => true
                );

                $data2[] = array(
                    'name'=> 'ROL',
                    'type'=> 'line',
                    'data'=> $dataEmissao,
                    // 'description'=> $dataEmissao,
                    'x'=> (float) $elementos['data'],
                    'y'=> (float) $elementos['rol'],
                    'show' => false
                );

                $data3[] = array(
                    'name'=> 'MB',
                    'type'=> 'line',
                    'data'=> $dataEmissao,
                    // 'description'=> $dataEmissao,
                    'x'=> (float) $elementos['data'],
                    'y'=> (float) $elementos['mb'],
                    'show' => true
                );

                $data4[] = array(
                    'name'=> 'Quantidade',
                    'type'=> 'column',
                    // 'data'=> $dataEmissao,
                    'description'=> $dataEmissao,
                    'x'=> (float) $elementos['data'],
                    'y'=> (float) $elementos['qtde'],
                    'show' => true
                );

                $data5[] = array(
                    'name'=> 'Nota',
                    'type'=> 'column',
                    'data'=> $dataEmissao,
                    // 'description'=> $dataEmissao,
                    'x'=> (float) $elementos['data'],
                    'y'=> (float) $elementos['nf'],
                    'show' => false
                );

                // $categories[] = (float) $elementos['data'];
                
            }
            $data[] = $data1;
            $data[] = $data2;
            $data[] = $data3;
            $data[] = $data4;
            $data[] = $data5;

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }

        $objReturn = $this->getCallbackModel();
        // $objReturn->categories = $categories;
        
        return $objReturn;
    }

    public function produtoposicionamentoAction()
    {
        $data = array();

        ini_set('memory_limit', '256M');
        
        try {

            $rede       = $this->params()->fromPost('rede',null);
            $filial     = $this->params()->fromPost('filial',null);
            $pData      = $this->params()->fromPost('data',null);
            $pDataInicio= $this->params()->fromPost('datainicio',null);
            $pDataFim   = $this->params()->fromPost('datafim',null);
            $idMarcas   = $this->params()->fromPost('idMarcas',null);
            $codProdutos= $this->params()->fromPost('produto',null);
            $idPessoas  = $this->params()->fromPost('cliente',null);
            $pareto     = $this->params()->fromPost('pareto',null);
            $paretoMb   = $this->params()->fromPost('paretoMb',null);
            $idEixos    = $this->params()->fromPost('idEixos',null);

            $em = $this->getEntityManager();

            /////////////////////////////////////////////////////////////////
            $paramRede ='apelido,';
            $paramRede2 ='em.apelido,';
            if($rede ==  'true'){
                $paramRede ='';
                $paramRede2 ='';
            }
            if($filial){
                $filial = implode(",",json_decode($filial));
            }
            $andFilial ='';
            if($filial){
                $andFilial = " and vi.id_empresa in ($filial)";
            }

            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($idPessoas){
                $idPessoas =  implode(",",json_decode($idPessoas));
            }

            if($idEixos){
                $idEixos = json_decode($idEixos);
            }else{
                $idEixos = new \stdClass;
                $idEixos->x = 'rol';
                $idEixos->y = 'mb';
            }
            if($pareto){
                $pareto =  json_decode($pareto);
            }
            if($pareto){
                $and_accumulated = "and med_accumulated >= $pareto[0] and med_accumulated <= $pareto[1]";
            }else{
                $and_accumulated = "and med_accumulated >= 0 and med_accumulated <= 80";
            }
            if($paretoMb){
                $paretoMb =  json_decode($paretoMb);
            }
            if($paretoMb){
                $and_mb = "and mb >= $paretoMb[0] and mb <= $paretoMb[1]";
            }else{
                $and_mb = "and mb > 0 and mb <= 50";
            }
            /////////////////////////////////////////////////////////////////
            
            $andEmpEstoque = '';
            $andEmpVi      = '';

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
            if($idMarcas){
                $andMarca = "and ic.id_marca in ($idMarcas)";
            }
            $andProduto = '';
            if($codProdutos){
                $andProduto = " and i.cod_item||c.descricao in ('$codProdutos')";
            }
            $andCliente = '';
            if($idPessoas){
                $andCliente = " and p.id_pessoa in ($idPessoas)";
            }

            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql1 = "select to_char($sysdateInicio,'dd/mm/yyyy')  as datainicio,
                            to_char($sysdateFim,'dd/mm/yyyy') as datafim 
                        from dual";

            $stmt = $conn->prepare($sql1);
            $stmt->execute();
            $resultCount = $stmt->fetchAll();

            $sql = "select $paramRede
                        codProduto,
                        descricao,
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
                        med_accumulated
                    from (select $paramRede
                            codProduto,
                            descricao,
                            rol,
                            lb,
                            mb,
                            qtde,
                            nf,
                            fr_rol,
                            sum(sum(fr_rol)) over (partition by rede order by rol desc rows unbounded preceding) as med_accumulated  
                        from (select rede, $paramRede codProduto, descricao,
                                        rol,
                                        lb,
                                        mb,
                                        qtde,
                                        nf,
                                        100*ratio_to_report((case when rol > 0 then rol end)) over (partition by rede) fr_rol
                                from (select 'JS' as rede,
                                                $paramRede2
                                                i.cod_item||c.descricao codProduto,
                                                i.descricao,
                                                sum(vi.rob) as rob,
                                                sum(vi.rol) as rol,
                                                sum(vi.custo) as cmv,
                                                sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                                round((case when sum(rol) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                                sum(vi.qtde) as qtde,
                                                count(distinct vi.numero_nf) as nf,
                                                count(distinct vi.id_pessoa) as cc
                                        from pricing.vm_ie_ve_venda_item vi, 
                                                ms.tb_item_categoria ic,
                                                ms.tb_item i,
                                                ms.tb_categoria c, 
                                                ms.empresa em,
                                                ms.tb_marca m,
                                                ms.pessoa p
                                        where vi.id_item = ic.id_item
                                        and vi.id_categoria = ic.id_categoria
                                        and vi.id_item = i.id_item
                                        and vi.id_categoria = c.id_categoria
                                        and vi.id_empresa = em.id_empresa
                                        and ic.id_marca = m.id_marca
                                        and vi.id_pessoa = p.id_pessoa
                                        --and vi.id_empresa = 23
                                        $andFilial
                                        $andData
                                        $andMarca
                                        $andProduto
                                        $andCliente
                                        -- and trunc(vi.data_emissao) >= '01/01/2021'
                                        -- and trunc(vi.data_emissao) < sysdate                                    
                                        --and ic.id_marca not in ()
                                        group by $paramRede2 i.descricao, i.cod_item||c.descricao))
                    group by rede, $paramRede codProduto, descricao, rol, lb, mb, qtde, nf, fr_rol)
                    where 1=1
                    $and_mb
                    and rol > 0
                    -- Remover esse filtro se utilizar o filtro de marca
                    $and_accumulated
                    order by med_accumulated asc";
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
            $arrayProduto = array();
            foreach ($resultSet as $row) {
                $elementos = $hydrator->extract($row);

                $filial = '';
                if($rede == 'false'){
                    $filial = $elementos['apelido'];
                }

                $arrayProduto[] = array(
                    'x'=> (float)$elementos[$idEixos->x],
                    'y'=> (float)$elementos[$idEixos->y],
                    'filial'=> $filial,
                    'idPessoa' => $elementos['codproduto'],
                    'nome' => $elementos['descricao'],
                    'decx' => $elementos['dec'.$idEixos->x],
                    'decy' => $elementos['dec'.$idEixos->y]
                );

            }

            $data = array(
                    array(
                        'name' => 'Produto',
                        'color'=> 'rgba(223, 83, 83, .5)',
                        'data' => $arrayProduto
                    )
                )
            ;

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
            
            $sql = "";

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

    
    public function listarprodutos2Action()
    {
        $data = array();

        $filial     = $this->params()->fromQuery('filial',null);
        $marca      = $this->params()->fromQuery('marca',null); //Ex: 130,128,131,129,146,136
        $curvas     = $this->params()->fromQuery('curvas',null);
        $produtos   = $this->params()->fromQuery('produtos',null);
        $dtinicio   = $this->params()->fromQuery('dtinicio',null);
        $dtfinal    = $this->params()->fromQuery('dtfinal',null);

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';

            if($marca){
                $marca = implode(",",json_decode($marca));
            }
            if($marca){
                $andSql .= " and ic.id_marca in ($marca)";
            }

            if($filial){
                $filial = implode(",",json_decode($filial));
            }
            if($filial){
                $andSql .= " and vi.id_empresa in ($filial)";
            }

            $sysdateInicio = 'add_months(trunc(sysdate,\'MM\'),-0)';
            $sysdateFim = 'sysdate';
            if($dtinicio){
                $andSql .= " and trunc(vi.data_emissao) >= $sysdateInicio";
            }else{
                $andSql .= " and ( vi.data_emissao > add_months(sysdate, -6))";
            }

            if($dtfinal){
                $andSql .= " and trunc(vi.data_emissao) <= '$dtfinal'";
            }

            if($curvas == 'null'){
                $curvas = '';
            }
            if($curvas){
                $curvas = implode("','",json_decode($curvas));
            }
            if($curvas){
                $andSql .= " and e.id_curva_abc in ('$curvas')";
            }

            if($produtos == 'null'){
                $produtos = '';
            }
            if($produtos){
                $produtos = implode("','",json_decode($produtos));
            }
            if($produtos){
                $andSql .= " and i.cod_item||c.descricao in ('$produtos')";
            }

            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql = "select i.cod_item||c.descricao as cod_item,
                            i.descricao,
                            --sum(vi.rol) as rol,
                            --sum(vi.qtde) as qtde
                            --count(distinct vi.numero_nf) as nf,
                            count(distinct vi.id_pessoa) as cc
                    from pricing.vm_ie_ve_venda_item vi,
                         ms.tb_item_categoria ic,
                         ms.tb_item i,
                         ms.tb_categoria c,
                         ms.tb_marca m,
                         ms.tb_estoque e
                    where vi.id_item = ic.id_item
                        and vi.id_categoria = ic.id_categoria
                        and vi.id_item = i.id_item
                        and vi.id_categoria = c.id_categoria
                        and ic.id_marca = m.id_marca
                        and vi.id_operacao in (4,7)
                        and vi.status_venda = 'A'     
                        and e.id_item = i.id_item
                        and e.id_categoria = c.id_categoria                               
                        --and m.descricao = 'YPF'                   
                        --and trunc(vi.data_emissao) >= '01/03/2021'
                        --and trunc(vi.data_emissao) <= '12/03/2021'
                        --and vi.id_empresa = 8
                        $andSql
                    group by i.cod_item||c.descricao, i.descricao
                    order by nvl(cc,0) desc
            ";

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
        
        $objReturn = $this->getCallbackModel();

        return $objReturn;
    }

    public function listarclientesAction()
    {
        $data = array();
        
        try {

            $pEmp    = $this->params()->fromQuery('emp',null);
            $idPessoa= $this->params()->fromQuery('idPessoa',null);
            $tipoSql = $this->params()->fromQuery('tipoSql',null);

            if(!$idPessoa){
                throw new \Exception('Parâmetros não informados.');
            }

            $em = $this->getEntityManager();

            if(!$tipoSql){
                $filtroCliente = "and ( id_pessoa like upper('".$idPessoa."%') or nome like upper('%".$idPessoa."%'))";
            }else{

                $Cliente =  implode("','",json_decode($idPessoa));
                $filtroCliente = "and id_pessoa in (".$Cliente.")";
            }
            
            $sql = "select id_pessoa,
                           nome descricao
                        from ms.pessoa
                    where 1 =1
                     $filtroCliente
                    order by id_pessoa";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            // $stmt->bindValue(1, $pEmp);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            // $hydrator->addStrategy('custo_contabil', new ValueStrategy);
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

    public function listareixosAction()
    {
        $data = array();
        
        try {

            $data[] = ['id'=> 'ROL','name'=> 'ROL','vExemplo'=> 1000000];
            $data[] = ['id'=> 'MB','name'=> 'MB','vExemplo'=> 30];
            $data[] = ['id'=> 'NF','name'=> 'NF','vExemplo'=> 1000];
            $data[] = ['id'=> 'QTDE','name'=> 'QTDE','vExemplo'=> 200];

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listaritemAction()
    {
        $data = array();

        $marca      = $this->params()->fromQuery('marca',null); //Ex: 130,128,131,129,146,136
        $filial     = $this->params()->fromQuery('filial',null);
        $datainicio = $this->params()->fromQuery('datainicio',null);
        $datafim    = $this->params()->fromQuery('datafim',null);
        $produtos   = $this->params()->fromQuery('produtos',null);
        
        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';
            $sysdateInicio = 'add_months(trunc(sysdate,\'MM\'),-0)';
            $sysdateFim = 'sysdate';

            if($marca){
                $marca = implode(",",json_decode($marca));
            }
            if($marca){
                $andSql .= " and ic.id_marca in ($marca)";
            }

            if($filial){
                $filial = implode(",",json_decode($filial));
            }
            if($filial){
                $andSql .= " and vi.id_empresa in ($filial)";
            }

            if($datainicio){
                $andSql .= " and trunc(vi.data_emissao) >= '$datainicio'";
            }else{
                $andSql .= " and trunc(vi.data_emissao) >= to_char($sysdateInicio,'dd/mm/yyyy')";
            }

            if($datafim){
                $andSql .= " and trunc(vi.data_emissao) <= '$datafim'";
            }else{
                $andSql .= " and trunc(vi.data_emissao) <= $sysdateFim";
            }

            if($produtos){
                $andSql .= " and i.cod_item||c.descricao in ('$produtos')";
            }

            $em = $this->getEntityManager();
            $conn = $em->getConnection();
            
            $sql = "select preco_medio, rol, notas, qtde, mb 
                        from (select rank() over (order by rol desc) rank, preco_medio,
                                    rol, notas, qtde, mb
                                from (select preco_medio,
                                            count(*) as notas,
                                            round(sum(rol),0) as rol, sum(qtde) as qtde, round(sum(lb)/sum(rol)*100,2) as mb
                                        from (select vi.id_empresa, 
                                                    vi.numero_nf,
                                                    sum(vi.rob) as rob,
                                                    round(sum(vi.rob)/sum(vi.qtde),2) as preco_medio,
                                                    sum(vi.rol) as rol,
                                                    --sum(vi.custo) as cmv,
                                                    sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                                    --round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                                    sum(vi.qtde) as qtde
                                                    --count(distinct vi.numero_nf) as nf,
                                                    --count(distinct vi.id_pessoa) as cc
                                                from pricing.vm_ie_ve_venda_item vi,
                                                     ms.tb_item_categoria ic,
                                                     ms.tb_item i,
                                                     ms.tb_categoria c
                                            where vi.id_item = ic.id_item
                                            and vi.id_categoria = ic.id_categoria
                                            and vi.id_item = i.id_item
                                            and vi.id_categoria = c.id_categoria
                                            and vi.id_operacao in (4,7)
                                            and vi.status_venda = 'A'
                                            --and i.cod_item||c.descricao = 'JS00506.0'
                                            --and trunc(vi.data_emissao) >= '01/03/2021'
                                            --and trunc(vi.data_emissao) <= '12/03/2021'
                                            --and vi.id_empresa = 8
                                            $andSql
                                            group by vi.id_empresa, vi.numero_nf)
                                    group by preco_medio))
                    where rank <= 18
                    order by preco_medio desc
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('preco_medio', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            $orderRol = array();
            $cont = 0;
            foreach ($resultSet as $row) {
                $data[] = $hydrator->extract($row);

                $data[$cont]['precoMedio'] = $data[$cont]['precoMedio'];
                $data[$cont]['notas'] = (float) $data[$cont]['notas'];
                $data[$cont]['rol'] = (float) $data[$cont]['rol'];
                $data[$cont]['qtde'] = (float) $data[$cont]['qtde'];
                $data[$cont]['mb'] = $data[$cont]['mb'];
                // $data[$cont]['order'] = $cont;

                $orderRol[] = (float) $data[$cont]['rol'];

                $cont++;
            }

            $cont = 0;
            asort($orderRol);
            foreach ($data as $row) {

                $contRol=0;
                foreach ($orderRol as $key => $val) {

                    if($data[$cont]['rol'] == $val){
                        $data[$cont]['order'] = $contRol;
                    }
                    $contRol++;
                }
                $cont++;
            }

            $this->setCallbackData($data);
            
        } catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        $objReturn = $this->getCallbackModel();

        // $objReturn->total = $resultCount[0]['TOTALCOUNT'];

        return $objReturn;
    }
    
}
