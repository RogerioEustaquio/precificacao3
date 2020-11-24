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

class FiiController extends AbstractRestfulController
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

    public function listarfichaitemheaderAction()
    {
        $data = array();
        
        try {
            $data = $this->params()->fromPost('data',null);
            $em = $this->getEntityManager();

            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            $sql = "select to_char(add_months(trunc($sysdate,'MM'),-11),'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-10),'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-9), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-8), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-7), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-6), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-5), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-4), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-3), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-2), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-1), 'MM') as id from dual union all
                    select to_char(add_months(trunc($sysdate,'MM'),-0), 'MM') as id from dual
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
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarfichaitemAction()
    {
        $data = array();
        
        try {

            $idEmpresas = $this->params()->fromQuery('idEmpresas',null);
            $idMarcas   = $this->params()->fromQuery('idMarcas',null);
            $codProdutos= $this->params()->fromQuery('codProdutos',null);
            $tpPessoas  = $this->params()->fromQuery('tpPessoas',null);
            $data       = $this->params()->fromQuery('data',null);

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas = implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas = implode("','",json_decode($tpPessoas));
            }

            $andSql = '';
            if($idEmpresas){
                $andSql = " and vi.id_empresa in ($idEmpresas)";
            }

            if($idMarcas){
                $andSql .= " and m.id_marca in ($idMarcas)";
            }

            if($codProdutos){
                $andSql .= " and i.cod_item||c.descricao in ('$codProdutos')";
            }

            if($tpPessoas){
                $andSql .= " and p.tipo_pessoa in ('$tpPessoas')";
            }
            
            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            if($data){
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc($sysdate,'MM'),-11)";
                $andSql .= " and trunc(vi.data_emissao, 'MM') <= add_months(trunc($sysdate,'MM'),0)";
            }else{
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)";
            }
            
            $em = $this->getEntityManager();
            
            $meses = [null,
                     'Janeiro',
                     'Fevereiro',
                     'Março',
                     'Abril',
                     'Maio',
                     'Junho',
                     'Julho',
                     'Agosto',
                     'Setembro',
                     'Outubro',
                     'Novembro',
                     'Dezembro'];

            $conn = $em->getConnection();

            $sql = "select add_months(trunc($sysdate,'MM'),-11) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-10) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-9) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-8) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-7) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-6) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-5) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-4) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-3) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-2) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-1) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-0) as id from dual            
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data1 = array();
            $categories = array();

            $arrayDesc      = array();
            $arrayPreco     = array();
            $arrayImposto   = array();
            $arrayRolUni    = array();
            $arrayCusto     = array();
            $arrayImpostoPc = array();
            $arrayDescPc    = array();
            $arrayRob       = array();
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();
            $arrayMb        = array();
            $arrayQtde      = array();
            $arrayNf        = array();
            $arrayCc        = array();

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
                $arrayImpostoPc[]   = 0;
                $arrayDescPc[]      = 0;
                $arrayRob[]         = 0;
                $arrayRol[]         = 0;
                $arrayCmv[]         = 0;
                $arrayLb[]          = 0;
                $arrayMb[]          = 0;
                $arrayQtde[]        = 0;
                $arrayNf[]          = 0;
                $arrayCc[]          = 0;

            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rob,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc
                    from (select trunc(vi.data_emissao, 'MM') as data,
                                  round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                  round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
                                  round((case when sum(qtde) > 0 then ((sum(vi.rob)-sum(vi.rol))/sum(rob))*100 end),2) as imposto_perc,
                                  round((case when sum(qtde) > 0 then (sum(vi.desconto)/sum(rob))*100 end),2) as desconto_perc,
                                  sum(vi.rob) as rob,
                                  sum(vi.rol) as rol,
                                  sum(vi.custo) as cmv,
                                  sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                  round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                  sum(vi.qtde) as qtde,
                                  count(distinct vi.numero_nf) as nf,
                                  count(distinct vi.id_pessoa) as cc
                            from pricing.vm_ie_ve_venda_item vi,
                                ms.empresa e,
                                ms.tb_item_categoria ic,
                                ms.tb_item i,
                                ms.tb_categoria c,
                                ms.tb_marca m,
                                ms.pessoa p
                           where vi.id_empresa = e.id_empresa
                           and vi.id_item = ic.id_item
                           and vi.id_categoria = ic.id_categoria
                           and vi.id_item = i.id_item
                           and vi.id_categoria = c.id_categoria
                           and ic.id_marca = m.id_marca
                           and vi.id_pessoa = p.id_pessoa(+)
                           $andSql
                           group by trunc(vi.data_emissao, 'MM')) b
                    where 1 = 1
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('preco_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_uni', new ValueStrategy);
            $hydrator->addStrategy('rol_uni', new ValueStrategy);
            $hydrator->addStrategy('custo_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_perc', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rob', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('nf', new ValueStrategy);
            $hydrator->addStrategy('cc', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            $cont = 0;

            foreach ($resultSet as $row) {

                $elementos = $hydrator->extract($row);

                if($categories[$cont] == $meses[(float)substr($elementos['data'], 3, 2)]){

                    $arrayDesc[$cont]        = (float)$elementos['descontoUni'];
                    $arrayPreco[$cont]       = (float)$elementos['precoUni'];
                    $arrayImposto[$cont]     = (float)$elementos['impostoUni'];
                    $arrayRolUni[$cont]      = (float)$elementos['rolUni'];
                    $arrayCusto[$cont]       = (float)$elementos['custoUni'];
                    $arrayImpostoPc[$cont]   = (float)$elementos['impostoPerc'];
                    $arrayDescPc[$cont]      = (float)$elementos['descontoPerc'];
                    $arrayRob[$cont]         = (float)$elementos['rob'];
                    $arrayRol[$cont]         = (float)$elementos['rol'];
                    $arrayCmv[$cont]         = (float)$elementos['cmv'];
                    $arrayLb[$cont]          = (float)$elementos['lb'];
                    $arrayMb[$cont]          = (float)$elementos['mb'];
                    $arrayQtde[$cont]        = (float)$elementos['qtde'];
                    $arrayNf[$cont]          = (float)$elementos['nf'];
                    $arrayCc[$cont]          = (float)$elementos['cc'];
                }

                $cont++;
            }

            $data = array();

            $data[] = ['indicador'=>'Desconto Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayDesc[0],
                        'valorM10'=> $arrayDesc[1],
                        'valorM9'=> $arrayDesc[2],
                        'valorM8'=> $arrayDesc[3],
                        'valorM7'=> $arrayDesc[4],
                        'valorM6'=> $arrayDesc[5],
                        'valorM5'=> $arrayDesc[6],
                        'valorM4'=> $arrayDesc[7],
                        'valorM3'=> $arrayDesc[8],
                        'valorM2'=> $arrayDesc[9],
                        'valorM1'=> $arrayDesc[10],
                        'valorM0'=> $arrayDesc[11]
            ];
            
            $data[] = ['indicador'=>'% Desconto',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayDescPc[0],
                        'valorM10'=> $arrayDescPc[1],
                        'valorM9'=> $arrayDescPc[2],
                        'valorM8'=> $arrayDescPc[3],
                        'valorM7'=> $arrayDescPc[4],
                        'valorM6'=> $arrayDescPc[5],
                        'valorM5'=> $arrayDescPc[6],
                        'valorM4'=> $arrayDescPc[7],
                        'valorM3'=> $arrayDescPc[8],
                        'valorM2'=> $arrayDescPc[9],
                        'valorM1'=> $arrayDescPc[10],
                        'valorM0'=> $arrayDescPc[11]
            ];

            $data[] = [ 'indicador'=>'Preço Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayPreco[0],
                        'valorM10'=> $arrayPreco[1],
                        'valorM9'=> $arrayPreco[2],
                        'valorM8'=> $arrayPreco[3],
                        'valorM7'=> $arrayPreco[4],
                        'valorM6'=> $arrayPreco[5],
                        'valorM5'=> $arrayPreco[6],
                        'valorM4'=> $arrayPreco[7],
                        'valorM3'=> $arrayPreco[8],
                        'valorM2'=> $arrayPreco[9],
                        'valorM1'=> $arrayPreco[10],
                        'valorM0'=> $arrayPreco[11]
            ];

            $data[] = ['indicador'=>'Imposto Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayImposto[0],
                        'valorM10'=> $arrayImposto[1],
                        'valorM9'=> $arrayImposto[2],
                        'valorM8'=> $arrayImposto[3],
                        'valorM7'=> $arrayImposto[4],
                        'valorM6'=> $arrayImposto[5],
                        'valorM5'=> $arrayImposto[6],
                        'valorM4'=> $arrayImposto[7],
                        'valorM3'=> $arrayImposto[8],
                        'valorM2'=> $arrayImposto[9],
                        'valorM1'=> $arrayImposto[10],
                        'valorM0'=> $arrayImposto[11]
            ];

            $data[] = ['indicador'=>'% Imposto',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayImpostoPc[0],
                        'valorM10'=> $arrayImpostoPc[1],
                        'valorM9'=> $arrayImpostoPc[2],
                        'valorM8'=> $arrayImpostoPc[3],
                        'valorM7'=> $arrayImpostoPc[4],
                        'valorM6'=> $arrayImpostoPc[5],
                        'valorM5'=> $arrayImpostoPc[6],
                        'valorM4'=> $arrayImpostoPc[7],
                        'valorM3'=> $arrayImpostoPc[8],
                        'valorM2'=> $arrayImpostoPc[9],
                        'valorM1'=> $arrayImpostoPc[10],
                        'valorM0'=> $arrayImpostoPc[11]
            ];

            $data[] = ['indicador'=>'ROL Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayRolUni[0],
                        'valorM10'=> $arrayRolUni[1],
                        'valorM9'=> $arrayRolUni[2],
                        'valorM8'=> $arrayRolUni[3],
                        'valorM7'=> $arrayRolUni[4],
                        'valorM6'=> $arrayRolUni[5],
                        'valorM5'=> $arrayRolUni[6],
                        'valorM4'=> $arrayRolUni[7],
                        'valorM3'=> $arrayRolUni[8],
                        'valorM2'=> $arrayRolUni[9],
                        'valorM1'=> $arrayRolUni[10],
                        'valorM0'=> $arrayRolUni[11]
            ];
            
            $data[] = ['indicador'=>'Custo Unitário',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayCusto[0],
                        'valorM10'=> $arrayCusto[1],
                        'valorM9'=> $arrayCusto[2],
                        'valorM8'=> $arrayCusto[3],
                        'valorM7'=> $arrayCusto[4],
                        'valorM6'=> $arrayCusto[5],
                        'valorM5'=> $arrayCusto[6],
                        'valorM4'=> $arrayCusto[7],
                        'valorM3'=> $arrayCusto[8],
                        'valorM2'=> $arrayCusto[9],
                        'valorM1'=> $arrayCusto[10],
                        'valorM0'=> $arrayCusto[11]
            ];

            $data[] = ['indicador'=>'ROB',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRob[0],
                        'valorM10'=> $arrayRob[1],
                        'valorM9'=> $arrayRob[2],
                        'valorM8'=> $arrayRob[3],
                        'valorM7'=> $arrayRob[4],
                        'valorM6'=> $arrayRob[5],
                        'valorM5'=> $arrayRob[6],
                        'valorM4'=> $arrayRob[7],
                        'valorM3'=> $arrayRob[8],
                        'valorM2'=> $arrayRob[9],
                        'valorM1'=> $arrayRob[10],
                        'valorM0'=> $arrayRob[11]
            ];

            $data[] = ['indicador'=>'ROL',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayRol[0],
                        'valorM10'=> $arrayRol[1],
                        'valorM9'=> $arrayRol[2],
                        'valorM8'=> $arrayRol[3],
                        'valorM7'=> $arrayRol[4],
                        'valorM6'=> $arrayRol[5],
                        'valorM5'=> $arrayRol[6],
                        'valorM4'=> $arrayRol[7],
                        'valorM3'=> $arrayRol[8],
                        'valorM2'=> $arrayRol[9],
                        'valorM1'=> $arrayRol[10],
                        'valorM0'=> $arrayRol[11]
            ];

            $data[] = ['indicador'=>'CMV',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCmv[0],
                        'valorM10'=> $arrayCmv[1],
                        'valorM9'=> $arrayCmv[2],
                        'valorM8'=> $arrayCmv[3],
                        'valorM7'=> $arrayCmv[4],
                        'valorM6'=> $arrayCmv[5],
                        'valorM5'=> $arrayCmv[6],
                        'valorM4'=> $arrayCmv[7],
                        'valorM3'=> $arrayCmv[8],
                        'valorM2'=> $arrayCmv[9],
                        'valorM1'=> $arrayCmv[10],
                        'valorM0'=> $arrayCmv[11]
            ];

            $data[] = ['indicador'=>'LB',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayLb[0],
                        'valorM10'=> $arrayLb[1],
                        'valorM9'=> $arrayLb[2],
                        'valorM8'=> $arrayLb[3],
                        'valorM7'=> $arrayLb[4],
                        'valorM6'=> $arrayLb[5],
                        'valorM5'=> $arrayLb[6],
                        'valorM4'=> $arrayLb[7],
                        'valorM3'=> $arrayLb[8],
                        'valorM2'=> $arrayLb[9],
                        'valorM1'=> $arrayLb[10],
                        'valorM0'=> $arrayLb[11]
            ];

            $data[] = ['indicador'=>'MB',
                        'vDecimos'=> 2,
                        'valorM11'=> $arrayMb[0],
                        'valorM10'=> $arrayMb[1],
                        'valorM9'=> $arrayMb[2],
                        'valorM8'=> $arrayMb[3],
                        'valorM7'=> $arrayMb[4],
                        'valorM6'=> $arrayMb[5],
                        'valorM5'=> $arrayMb[6],
                        'valorM4'=> $arrayMb[7],
                        'valorM3'=> $arrayMb[8],
                        'valorM2'=> $arrayMb[9],
                        'valorM1'=> $arrayMb[10],
                        'valorM0'=> $arrayMb[11]
            ];

            $data[] = ['indicador'=>'Quantidade',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayQtde[0],
                        'valorM10'=> $arrayQtde[1],
                        'valorM9'=> $arrayQtde[2],
                        'valorM8'=> $arrayQtde[3],
                        'valorM7'=> $arrayQtde[4],
                        'valorM6'=> $arrayQtde[5],
                        'valorM5'=> $arrayQtde[6],
                        'valorM4'=> $arrayQtde[7],
                        'valorM3'=> $arrayQtde[8],
                        'valorM2'=> $arrayQtde[9],
                        'valorM1'=> $arrayQtde[10],
                        'valorM0'=> $arrayQtde[11]
            ];

            $data[] = ['indicador'=>'Nota Fiscal',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayNf[0],
                        'valorM10'=> $arrayNf[1],
                        'valorM9'=> $arrayNf[2],
                        'valorM8'=> $arrayNf[3],
                        'valorM7'=> $arrayNf[4],
                        'valorM6'=> $arrayNf[5],
                        'valorM5'=> $arrayNf[6],
                        'valorM4'=> $arrayNf[7],
                        'valorM3'=> $arrayNf[8],
                        'valorM2'=> $arrayNf[9],
                        'valorM1'=> $arrayNf[10],
                        'valorM0'=> $arrayNf[11]
            ];

            $data[] = ['indicador'=>'Cliente',
                        'vDecimos'=> 0,
                        'valorM11'=> $arrayCc[0],
                        'valorM10'=> $arrayCc[1],
                        'valorM9'=> $arrayCc[2],
                        'valorM8'=> $arrayCc[3],
                        'valorM7'=> $arrayCc[4],
                        'valorM6'=> $arrayCc[5],
                        'valorM5'=> $arrayCc[6],
                        'valorM4'=> $arrayCc[7],
                        'valorM3'=> $arrayCc[8],
                        'valorM2'=> $arrayCc[9],
                        'valorM1'=> $arrayCc[10],
                        'valorM0'=> $arrayCc[11]
            ];

            $this->setCallbackData($data);
            
        }  catch (\Exception $e) {
            $this->setCallbackError($e->getMessage());
        }
        
        return $this->getCallbackModel();
    }

    public function listarfichaitemgraficoAction()
    {
        $data = array();
        
        try {
            $idEmpresas = $this->params()->fromPost('idEmpresas',null);
            $idMarcas   = $this->params()->fromPost('idMarcas',null);
            $codProdutos= $this->params()->fromPost('codProdutos',null);
            $tpPessoas  = $this->params()->fromPost('tpPessoas',null);
            $data       = $this->params()->fromPost('data',null);

            if($idEmpresas){
                $idEmpresas =  implode(",",json_decode($idEmpresas));
            }
            if($idMarcas){
                $idMarcas = implode(",",json_decode($idMarcas));
            }
            if($codProdutos){
                $codProdutos =  implode("','",json_decode($codProdutos));
            }
            if($tpPessoas){
                $tpPessoas = implode("','",json_decode($tpPessoas));
            }

            $andSql = '';
            if($idEmpresas){
                $andSql = " and vi.id_empresa in ($idEmpresas)";
            }

            if($idMarcas){
                $andSql .= " and m.id_marca in ($idMarcas)";
            }

            if($codProdutos){
                $andSql .= " and i.cod_item||c.descricao in ('$codProdutos')";
            }

            if($tpPessoas){
                $andSql .= " and p.tipo_pessoa in ('$tpPessoas')";
            }
            
            if($data){
                $sysdate = "to_date('01/".$data."')";
            }else{
                $sysdate = 'sysdate';
            }

            if($data){
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc($sysdate,'MM'),-11)";
                $andSql .= " and trunc(vi.data_emissao, 'MM') <= add_months(trunc($sysdate,'MM'),0)";
            }else{
                $andSql .= " and trunc(vi.data_emissao, 'MM') >= add_months(trunc(sysdate,'MM'),-11)";
            }
            
            $em = $this->getEntityManager();
            
            $meses = [null,
                     'Janeiro',
                     'Fevereiro',
                     'Março',
                     'Abril',
                     'Maio',
                     'Junho',
                     'Julho',
                     'Agosto',
                     'Setembro',
                     'Outubro',
                     'Novembro',
                     'Dezembro'];

            $conn = $em->getConnection();

            $sql = "select add_months(trunc($sysdate,'MM'),-11) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-10) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-9) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-8) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-7) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-6) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-5) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-4) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-3) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-2) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-1) as id from dual union all
                    select add_months(trunc($sysdate,'MM'),-0) as id from dual            
            ";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data1 = array();
            $categories = array();

            $arrayDesc      = array();
            $arrayPreco     = array();
            $arrayImposto   = array();
            $arrayRolUni    = array();
            $arrayCusto     = array();
            $arrayImpostoPc = array();
            $arrayDescPc    = array();
            $arrayRob       = array();
            $arrayRol       = array();
            $arrayCmv       = array();
            $arrayLb        = array();
            $arrayMb        = array();
            $arrayQtde      = array();
            $arrayNf        = array();
            $arrayCc        = array();

            foreach ($resultSet as $row) {
                $data1 = $hydrator->extract($row);
                $categories[] = $meses[(float) substr($data1['id'], 3, 2)];

                $arrayDesc[]        = 0;
                $arrayPreco[]       = 0;
                $arrayImposto[]     = 0;
                $arrayRolUni[]      = 0;
                $arrayCusto[]       = 0;
                $arrayLucro[]       = 0;
                $arrayImpostoPc[]   = 0;
                $arrayDescPc[]      = 0;
                $arrayRob[]         = 0;
                $arrayRol[]         = 0;
                $arrayCmv[]         = 0;
                $arrayLb[]          = 0;
                $arrayMb[]          = 0;
                $arrayQtde[]        = 0;
                $arrayNf[]          = 0;
                $arrayCc[]          = 0;

            }

            $sql = " select b.data,
                            b.desconto_uni,
                            b.preco_uni,
                            b.imposto_uni,
                            b.rol_uni,
                            b.custo_uni,
                            b.lucro_uni,
                            b.imposto_perc,
                            b.desconto_perc,
                            b.rob,
                            b.rol,
                            b.cmv,
                            b.lb,
                            b.mb,
                            b.qtde,
                            b.nf,
                            b.cc
                    from (select trunc(vi.data_emissao, 'MM') as data,
                                  round((case when sum(qtde) > 0 then sum(vi.desconto)/sum(qtde) end),2) as desconto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rob)/sum(qtde) end),2) as preco_uni,
                                  round((case when sum(qtde) > 0 then (sum(vi.rob)-sum(vi.rol))/sum(qtde) end),2) as imposto_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.rol)/sum(qtde) end),2) as rol_uni,
                                  round((case when sum(qtde) > 0 then sum(vi.custo)/sum(qtde) end),2) as custo_uni,
                                  round((case when sum(qtde) > 0 then sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(qtde) end),2) as lucro_uni,
                                  round((case when sum(qtde) > 0 then ((sum(vi.rob)-sum(vi.rol))/sum(rob))*100 end),2) as imposto_perc,
                                  round((case when sum(qtde) > 0 then (sum(vi.desconto)/sum(rob))*100 end),2) as desconto_perc,
                                  sum(vi.rob) as rob,
                                  sum(vi.rol) as rol,
                                  sum(vi.custo) as cmv,
                                  sum(nvl(vi.rol,0)-nvl(vi.custo,0)) as lb,
                                  round((case when sum(qtde) > 0 then (sum(nvl(vi.rol,0)-nvl(vi.custo,0))/sum(rol))*100 end),2) as mb,
                                  sum(vi.qtde) as qtde,
                                  count(distinct vi.numero_nf) as nf,
                                  count(distinct vi.id_pessoa) as cc
                            from pricing.vm_ie_ve_venda_item vi,
                                ms.empresa e,
                                ms.tb_item_categoria ic,
                                ms.tb_item i,
                                ms.tb_categoria c,
                                ms.tb_marca m,
                                ms.pessoa p
                           where vi.id_empresa = e.id_empresa
                           and vi.id_item = ic.id_item
                           and vi.id_categoria = ic.id_categoria
                           and vi.id_item = i.id_item
                           and vi.id_categoria = c.id_categoria
                           and ic.id_marca = m.id_marca
                           and vi.id_pessoa = p.id_pessoa(+)
                           $andSql
                           group by trunc(vi.data_emissao, 'MM')) b
                    where 1 = 1
            ";

            // print "$sql";
            // exit;

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('preco_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_uni', new ValueStrategy);
            $hydrator->addStrategy('rol_uni', new ValueStrategy);
            $hydrator->addStrategy('custo_uni', new ValueStrategy);
            $hydrator->addStrategy('lucro_uni', new ValueStrategy);
            $hydrator->addStrategy('imposto_perc', new ValueStrategy);
            $hydrator->addStrategy('desconto_perc', new ValueStrategy);
            $hydrator->addStrategy('rob', new ValueStrategy);
            $hydrator->addStrategy('rol', new ValueStrategy);
            $hydrator->addStrategy('cmv', new ValueStrategy);
            $hydrator->addStrategy('lb', new ValueStrategy);
            $hydrator->addStrategy('mb', new ValueStrategy);
            $hydrator->addStrategy('qtde', new ValueStrategy);
            $hydrator->addStrategy('nf', new ValueStrategy);
            $hydrator->addStrategy('cc', new ValueStrategy);
            $stdClass = new StdClass;
            $resultSet = new HydratingResultSet($hydrator, $stdClass);
            $resultSet->initialize($results);

            $data = array();
            $cont = 0;

            foreach ($resultSet as $row) {

                $elementos = $hydrator->extract($row);

                if($categories[$cont] == $meses[(float)substr($elementos['data'], 3, 2)]){

                    $arrayDesc[$cont]        = (float)$elementos['descontoUni'];
                    $arrayPreco[$cont]       = (float)$elementos['precoUni'];
                    $arrayImposto[$cont]     = (float)$elementos['impostoUni'];
                    $arrayRolUni[$cont]      = (float)$elementos['rolUni'];
                    $arrayCusto[$cont]       = (float)$elementos['custoUni'];
                    $arrayLucro[$cont]       = (float)$elementos['lucroUni'];
                    $arrayImpostoPc[$cont]   = (float)$elementos['impostoPerc'];
                    $arrayDescPc[$cont]      = (float)$elementos['descontoPerc'];
                    $arrayRob[$cont]         = (float)$elementos['rob'];
                    $arrayRol[$cont]         = (float)$elementos['rol'];
                    $arrayCmv[$cont]         = (float)$elementos['cmv'];
                    $arrayLb[$cont]          = (float)$elementos['lb'];
                    $arrayMb[$cont]          = (float)$elementos['mb'];
                    $arrayQtde[$cont]        = (float)$elementos['qtde'];
                    $arrayNf[$cont]          = (float)$elementos['nf'];
                    $arrayCc[$cont]          = (float)$elementos['cc'];
                }

                $cont++;
            }

            $colors = ["#63b598","#ce7d78","#ea9e70","#a48a9e","#c6e1e8","#648177","#0d5ac1","#f205e6","#1c0365","#14a9ad","#4ca2f9"];

            // $this->setCallbackData($data);
            return new JsonModel(
                array(
                    'success' => true,
                    'data' => array(
                        'categories' => $categories,
                        'series' => array(                            
                            array(
                                'name' => 'Preço Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(165,170,217,1)',
                                'data' => $arrayPreco,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                ),
                            ),
                            array(
                                'name' => 'Desconto Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(126,86,134,.9)',
                                'data' => $arrayDesc,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Imposto Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(46, 36, 183, 1)',
                                'data' => $arrayImposto,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRolUni,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Custo Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCusto,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Lucro Unitário',
                                'yAxis'=> 0,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayLucro,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Imposto',
                                'yAxis'=> 6,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayImpostoPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => '% Desconto',
                                'yAxis'=> 7,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayDescPc,
                                'vFormat' => '%',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '%',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROB',
                                'yAxis'=> 8,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRob,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => 'R$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'ROL',
                                'yAxis'=> 8,
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayRol,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => 'R$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'CMV',
                                'yAxis'=> 8,
                                'color' => $colors[0],
                                // 'color' => 'rgba(221, 117, 85, 1)',
                                'data' => $arrayCmv,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => '{y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'LB',
                                'yAxis'=> 8,
                                'color' => $colors[1],
                                'data' => $arrayLb,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'MB',
                                'yAxis'=> 12,
                                'color' => $colors[2],
                                'data' => $arrayMb,
                                'vFormat' => '',
                                'vDecimos' => '2',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    'keyformat' => '$',
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Quantidade',
                                'yAxis'=> 13,
                                'color' => $colors[3],
                                'data' => $arrayQtde,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Nota Fiscal',
                                'yAxis'=> 14,
                                'color' => $colors[4],
                                'data' => $arrayNf,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            ),
                            array(
                                'name' => 'Cliente',
                                'yAxis'=> 15,
                                'color' => $colors[5],
                                'data' => $arrayCc,
                                'vFormat' => '',
                                'vDecimos' => '0',
                                'visible' => true,
                                'showInLegend' => true,
                                'dataLabels' => array(
                                    'enabled' => true,
                                    // 'format' => 'R$ {y}',
                                    'style' => array( 'fontSize' => '10')
                                    )
                            )
                        ),
                    )
                )
            );
            
        }  catch (\Exception $e) {
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
