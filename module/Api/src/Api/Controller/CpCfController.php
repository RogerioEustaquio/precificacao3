<?php
namespace Api\Controller;

use Zend\View\Model\JsonModel;
use Zend\Db\ResultSet\HydratingResultSet;
use Core\Stdlib\StdClass;
use Core\Hydrator\ObjectProperty;
use Core\Hydrator\Strategy\ValueStrategy;
use Core\Mvc\Controller\AbstractRestfulController;
use Zend\Json\Json;


class CpCfController extends AbstractRestfulController
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

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();

            if($usuario['empresa'] != "EC"){

                $sql = "select id_empresa, apelido as nome
                            from ms.empresa 
                        where id_matriz = 1 
                        and apelido = '".$usuario['empresa']."'
                    ";
            }else{

                $sql = "select id_empresa, apelido as nome
                            from ms.empresa 
                        where id_matriz = 1 
                        and id_empresa = 20
                        union all
                        select * from (
                            select id_empresa, apelido as nome from ms.empresa 
                            where id_matriz = 1 
                            and id_empresa not in (26, 11, 28, 27, 20)
                            order by apelido
                        )
                ";

            }
            
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

    public function listarmarcaAction()
    {
        $data = array();

        $emp         = $this->params()->fromQuery('emp',null);
        // $dtinicio    = $this->params()->fromQuery('dtinicio',null);
        // $dtfim       = $this->params()->fromQuery('dtfim',null);
        $produto     = $this->params()->fromQuery('produto',null);

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $andSql = '';
            if($emp  && $emp != "EC"){
                $andSql = " and em.apelido = '$emp'";
            }
            
            // if($dtinicio){
            //     $andSql .= " and trunc(c.data_emissao) >= '$dtinicio'";
            // }

            // if($dtfim){
            //     $andSql .= " and trunc(c.data_emissao) <= '$dtfim'";
            // }

            // if($produto){
            //     $andSql .= " and i.cod_item||c.descricao =  '$produto'";
            // }

            $em = $this->getEntityManager();
            
            $sql = "select distinct g.id_grupo_marca,
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
                    $andSql
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

    public function listaritemAction()
    {
        $data = array();

        $emp        = $this->params()->fromQuery('emp',null);
        $dtinicio   = $this->params()->fromQuery('dtinicio',null);
        $dtfim      = $this->params()->fromQuery('dtfim',null);
        $dtinicioe  = $this->params()->fromQuery('dtinicioe',null);
        $dtfime     = $this->params()->fromQuery('dtfime',null);
        $nrnota     = $this->params()->fromQuery('nrnota',null);
        $marca      = $this->params()->fromQuery('marca',null);

        $andSql = '';
        $andSqlVar = '';
        if($emp  && $emp != "EC"){
            $andSql = " and em.apelido = '$emp'";
            $andEmp = " and empresa.apelido = '$emp'";
        }
        
        if($marca){
            $andSql .= " and m.id_marca in ($marca)";
        }

        if($dtinicio){
            $andSql .= " and trunc(c.data_emissao) >= '$dtinicio'";
        }

        if($dtfim){
            $andSql .= " and trunc(c.data_emissao) <= '$dtfim'";
        }

        if($dtinicioe){
            $andSql .= " and trunc(c.data_entrada) >= '$dtinicioe'";
        }

        if($dtfime){
            $andSql .= " and trunc(c.data_entrada) <= '$dtfime'";
        }

        if($nrnota){
            $andSql .= " and c.numero_nota||'-'||c.serie_nota like '$nrnota%'";
        }

        if(!$andSql){
            $andSql = "and trunc(c.data_emissao) >= sysdate-30";
        }

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();

            $sql = "select emp,
                           nome,
                           to_char(min(data_emissao),'dd/mm/yyyy') data_inicio,
                           to_char(max(data_emissao),'dd/mm/yyyy') data_fim,
                           to_char(min(data_entrada),'dd/mm/yyyy') data_inicioe,
                           to_char(max(data_entrada),'dd/mm/yyyy') data_fime,
                           sum(case when nvl(custo_anterior,0) >0 then custo_anterior*qtde_operacao end) anterior_valor,
                           sum(custo_operacao*qtde_operacao) as ope_valor,
                           sum(qtde_operacao) as ope_qtde,
                           sum(case when nvl(custo_anterior,0)>0 then (custo_operacao - custo_anterior) * qtde_operacao end) ope_x_anterior_valor,
                           case when nvl(sum(custo_anterior*qtde_operacao),0) > 0
                                then round(100*(sum((case when nvl(custo_anterior,0) > 0 then (custo_operacao - custo_anterior)*qtde_operacao end))/sum((case when nvl(custo_anterior,0) > 0 then custo_anterior*qtde_operacao end))),2)
                                else null
                            end as ope_x_anterior_idx
                    from (
                        select emp,
                                id_operacao,
                                operacao,
                                data_emissao,
                                data_entrada,
                                cnpj,
                                nome,
                                numero_nota,
                                valor_nota,
                                id_marca,
                                marca,
                                cod_item,
                                descricao,
                                id_curva_abc,
                                fx_custo,
                                data_compra_anterior,
                                custo_anterior,
                                custo_operacao,
                                custo_resultante,
                                (case when custo_anterior > 0 then round(((custo_operacao/custo_anterior)-1)*100,2) end) as v_ope_anterior,
                                qtde_anterior, qtde_operacao, qtde_resultante,
                                custo_ult_ano_anterior,
                                (case when custo_ult_ano_anterior > 0 then round(((custo_operacao/custo_ult_ano_anterior)-1)*100,2) end) as v_ope_ult_ano_anterior,
                                custo_med_ano_anterior,
                                (case when custo_med_ano_anterior > 0 then round(((custo_operacao/custo_med_ano_anterior)-1)*100,2) end) as v_ope_med_ano_anterior,
                                custo_med_e_ano_anterior,
                                (case when custo_med_e_ano_anterior > 0 then round(((custo_operacao/custo_med_e_ano_anterior)-1)*100,2) end) as v_ope_med_e_ano_anterior,
                                custo_med_e_12m_anterior,
                                (case when custo_med_e_12m_anterior > 0 then round(((custo_operacao/custo_med_e_12m_anterior)-1)*100,2) end) as v_ope_med_e_12m_anterior,
                                custo_med_e_6m_anterior,
                                (case when custo_med_e_6m_anterior > 0 then round(((custo_operacao/custo_med_e_6m_anterior)-1)*100,2) end) as v_ope_med_e_6m_anterior,
                                custo_med_e_3m_anterior,
                                (case when custo_med_e_3m_anterior > 0 then round(((custo_operacao/custo_med_e_3m_anterior)-1)*100,2) end) as v_ope_med_e_3m_anterior 
                        from (
                            select em.apelido as emp,
                                    c.id_operacao,
                                    os.descricao as operacao,
                                    trunc(c.data_emissao) as data_emissao,
                                    trunc(c.data_entrada) as data_entrada,
                                    c.id_pessoa as cnpj,
                                    p.nome as nome,
                                    c.numero_nota||'-'||c.serie_nota as numero_nota,
                                    c.tot_nota as valor_nota,
                                    m.id_marca,
                                    m.descricao as marca,
                                    i.cod_item||ca.descricao as cod_item,
                                    i.descricao,
                                    e.id_curva_abc,
                                    (case when e.custo_contabil < 1 then '0'
                                        when e.custo_contabil >= 1 and e.custo_contabil < 6  then '1-5'
                                        when e.custo_contabil >= 6 and e.custo_contabil < 11  then '6-10'
                                        when e.custo_contabil >= 11 and e.custo_contabil < 26  then '11-25'
                                        when e.custo_contabil >= 26 and e.custo_contabil < 51  then '26-50'
                                        when e.custo_contabil >= 51 and e.custo_contabil < 101  then '51-100'
                                        when e.custo_contabil >= 101 and e.custo_contabil < 251  then '101-250'
                                        when e.custo_contabil >= 251 and e.custo_contabil < 501  then '251-500'
                                        when e.custo_contabil >= 501 and e.custo_contabil < 1001  then '501-1000'
                                        when e.custo_contabil >= 1001 and e.custo_contabil < 5001  then '1001-5000'
                                        when e.custo_contabil >= 5001 and e.custo_contabil < 10001  then '5001-10000'
                                        when e.custo_contabil >= 10001 then '10001-X'
                                    end) as fx_custo,
                                    k.data_compra_anterior,
                                    round(k.custo_anterior,2) as custo_anterior,
                                    round(k.custo_operacao,2) as custo_operacao,
                                    round(k.custo_resultante,2) as custo_resultante,
                                    k.qtde_anterior, k.qtde_operacao, k.qtde_resultante,
                                    pkg_help_variacao_custo.get_custo_ult_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_ult_ano_anterior,
                                    pkg_help_variacao_custo.get_custo_med_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_ano_anterior,
                                    pkg_help_variacao_custo.get_custo_med_e_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_ano_anterior,
                                    pkg_help_variacao_custo.get_custo_med_e_12m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_12m_anterior,
                                    pkg_help_variacao_custo.get_custo_med_e_6m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_6m_anterior,
                                    pkg_help_variacao_custo.get_custo_med_e_3m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_3m_anterior                               
                                from ms.cp_compra c,
                                    ms.cp_compra_item ci,
                                    (select id_empresa, id_cardex_item, id_item, id_categoria, 
                                            custo_anterior, custo_operacao, custo_resultante,
                                            qtde_anterior_estoque as qtde_anterior, qtde_operacao_estoque as qtde_operacao, qtde_saldo_estoque as qtde_resultante,
                                            trunc((select max(data_created) 
                                                from ms.cardex_item 
                                                where id_empresa = x.id_empresa 
                                                and id_item = x.id_item 
                                                and id_categoria = x.id_categoria
                                                and id_operacao = 1
                                                and status = 'A'
                                            and id_cardex_item < x.id_cardex_item)) as data_compra_anterior
                                        from ms.cardex_item x
                                        where status = 'A') k,
                                    ms.pessoa p,
                                    ms.empresa em,
                                    ms.tb_item_categoria ic,
                                    ms.tb_marca m,
                                    ms.tb_item i,
                                    ms.tb_categoria ca,
                                    ms.ms_operacao_sistema os,
                                    ms.tb_estoque e
                                where c.id_empresa = ci.id_empresa
                                and c.id_compra = ci.id_compra
                                and ci.id_empresa = k.id_empresa
                                and ci.id_cardex_item = k.id_cardex_item
                                and c.id_pessoa = p.id_pessoa
                                and c.id_empresa = em.id_empresa
                                and ci.id_item = ic.id_item 
                                and ci.id_categoria = ic.id_categoria
                                and ic.id_marca = m.id_marca
                                and ci.id_item = i.id_item
                                and ci.id_categoria = ca.id_categoria
                                and ci.id_empresa = e.id_empresa
                                and ci.id_item = e.id_item
                                and ci.id_categoria = e.id_categoria
                                and c.id_operacao = os.id_operacao
                                and c.id_operacao not in (10 /*Devolução de Venda*/, 45/*Entrada para analise de garantia*/, 14 /*Entrada Item em Transferencia*/, 50 /*Entrada para Reclassificac?o*/)
                                $andSql
                                --and m.descricao not in ('EMERGENCIAL')
                                --and trunc(c.data_entrada,'MM') = '01/01/2020' -- Pela entrada
                                --and m.descricao = 'YPF' 
                        )
                        where emp is not null
                    )
                    where nome is not null
                    group by emp, nome
                    order by emp
            ";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('anterior_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_x_anterior_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_x_anterior_idx', new ValueStrategy);
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

    public function listarnfitensAction()
    {
        $data = array();

        $emp        = $this->params()->fromQuery('emp',null);
        $dtinicio   = $this->params()->fromQuery('dtinicio',null);
        $dtfim      = $this->params()->fromQuery('dtfim',null);
        $dtinicioe  = $this->params()->fromQuery('dtinicioe',null);
        $dtfime     = $this->params()->fromQuery('dtfime',null);
        $nrnota     = $this->params()->fromQuery('nrnota',null);
        $marca      = $this->params()->fromQuery('marca',null);
        $cnpj       = $this->params()->fromQuery('cnpj',null);
        $nome       = $this->params()->fromQuery('nome',null);

        $andSql = '';
        $andSqlVar = '';
        if($emp && $emp != "EC"){
            $andSql = " and em.apelido = '$emp'";
            $andEmp = " and empresa.apelido = '$emp'";
        }
        
        if($marca){
            $andSql .= " and m.id_marca in ($marca)";
        }

        if($cnpj){
            $andSql .= " and c.id_pessoa = $cnpj";
        }

        if($nome){
            $andSql .= " and p.nome = '$nome'";
        }

        // if($dtinicio){
        //     $andSql .= " and trunc(c.data_emissao) >= '$dtinicio'";
        // }

        // if($dtfim){
        //     $andSql .= " and trunc(c.data_emissao) <= '$dtfim'";
        // }

        if($dtinicioe){
            $andSql .= " and trunc(c.data_entrada) >= '$dtinicioe'";
        }

        if($dtfime){
            $andSql .= " and trunc(c.data_entrada) <= '$dtfime'";
        }

        if($nrnota){
            $andSql .= " and c.numero_nota||'-'||c.serie_nota like '$nrnota%'";
        }

        if(!$andSql){
            $andSql = "and trunc(c.data_emissao) >= sysdate-30";
        }

        try {

            $session = $this->getSession();
            $usuario = $session['info'];

            $em = $this->getEntityManager();

            $sql = "select emp,
                           numero_nota,
                           data_emissao,
                           data_entrada,
                           cnpj,
                           nome,
                           cod_item,
                           descricao,
                           marca,
                           sum(case when nvl(custo_anterior,0) >0 then custo_anterior*qtde_operacao end) anterior_valor,
                           sum(custo_operacao*qtde_operacao) as ope_valor,
                           sum(qtde_operacao) as ope_qtde,
                           sum(case when nvl(custo_anterior,0)>0 then (custo_operacao - custo_anterior) * qtde_operacao end) ope_x_anterior_valor,
                           case when nvl(sum(custo_anterior*qtde_operacao),0) > 0
                                then round(100*(sum((case when nvl(custo_anterior,0) > 0 then (custo_operacao - custo_anterior)*qtde_operacao end))/sum((case when nvl(custo_anterior,0) > 0 then custo_anterior*qtde_operacao end))),2)
                                else null
                            end as ope_x_anterior_idx
                    from (select emp,
                                id_operacao,
                                operacao,
                                data_emissao,
                                data_entrada,
                                cnpj,
                                nome,
                                numero_nota,
                                valor_nota,
                                marca,
                                cod_item,
                                descricao,
                                id_curva_abc,
                                fx_custo,
                                data_compra_anterior,
                                custo_anterior,
                                custo_operacao,
                                custo_resultante,
                                (case when custo_anterior > 0 then round(((custo_operacao/custo_anterior)-1)*100,2) end) as v_ope_anterior,
                                qtde_anterior, qtde_operacao, qtde_resultante,
                                custo_ult_ano_anterior,
                                (case when custo_ult_ano_anterior > 0 then round(((custo_operacao/custo_ult_ano_anterior)-1)*100,2) end) as v_ope_ult_ano_anterior,
                                custo_med_ano_anterior,
                                (case when custo_med_ano_anterior > 0 then round(((custo_operacao/custo_med_ano_anterior)-1)*100,2) end) as v_ope_med_ano_anterior,
                                custo_med_e_ano_anterior,
                                (case when custo_med_e_ano_anterior > 0 then round(((custo_operacao/custo_med_e_ano_anterior)-1)*100,2) end) as v_ope_med_e_ano_anterior,
                                custo_med_e_12m_anterior,
                                (case when custo_med_e_12m_anterior > 0 then round(((custo_operacao/custo_med_e_12m_anterior)-1)*100,2) end) as v_ope_med_e_12m_anterior,
                                custo_med_e_6m_anterior,
                                (case when custo_med_e_6m_anterior > 0 then round(((custo_operacao/custo_med_e_6m_anterior)-1)*100,2) end) as v_ope_med_e_6m_anterior,
                                custo_med_e_3m_anterior,
                                (case when custo_med_e_3m_anterior > 0 then round(((custo_operacao/custo_med_e_3m_anterior)-1)*100,2) end) as v_ope_med_e_3m_anterior 
                            from ( select em.apelido as emp,
                                            c.id_operacao,
                                            os.descricao as operacao,
                                            trunc(c.data_emissao) as data_emissao,
                                            trunc(c.data_entrada) as data_entrada,
                                            c.id_pessoa as cnpj,
                                            p.nome as nome,
                                            c.numero_nota||'-'||c.serie_nota as numero_nota,
                                            c.tot_nota as valor_nota,
                                            m.descricao as marca,
                                            i.cod_item||ca.descricao as cod_item,
                                            i.descricao,
                                            e.id_curva_abc,
                                            (case when e.custo_contabil < 1 then '0'
                                                when e.custo_contabil >= 1 and e.custo_contabil < 6  then '1-5'
                                                when e.custo_contabil >= 6 and e.custo_contabil < 11  then '6-10'
                                                when e.custo_contabil >= 11 and e.custo_contabil < 26  then '11-25'
                                                when e.custo_contabil >= 26 and e.custo_contabil < 51  then '26-50'
                                                when e.custo_contabil >= 51 and e.custo_contabil < 101  then '51-100'
                                                when e.custo_contabil >= 101 and e.custo_contabil < 251  then '101-250'
                                                when e.custo_contabil >= 251 and e.custo_contabil < 501  then '251-500'
                                                when e.custo_contabil >= 501 and e.custo_contabil < 1001  then '501-1000'
                                                when e.custo_contabil >= 1001 and e.custo_contabil < 5001  then '1001-5000'
                                                when e.custo_contabil >= 5001 and e.custo_contabil < 10001  then '5001-10000'
                                                when e.custo_contabil >= 10001 then '10001-X'
                                            end) as fx_custo,
                                            k.data_compra_anterior,
                                            round(k.custo_anterior,2) as custo_anterior,
                                            round(k.custo_operacao,2) as custo_operacao,
                                            round(k.custo_resultante,2) as custo_resultante,
                                            k.qtde_anterior, k.qtde_operacao, k.qtde_resultante,
                                            pkg_help_variacao_custo.get_custo_ult_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_ult_ano_anterior,
                                            pkg_help_variacao_custo.get_custo_med_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_ano_anterior,
                                            pkg_help_variacao_custo.get_custo_med_e_ano_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_ano_anterior,
                                            pkg_help_variacao_custo.get_custo_med_e_12m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_12m_anterior,
                                            pkg_help_variacao_custo.get_custo_med_e_6m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_6m_anterior,
                                            pkg_help_variacao_custo.get_custo_med_e_3m_ant(ci.id_empresa, ci.id_item, ci.id_categoria, ci.id_cardex_item) as custo_med_e_3m_anterior
                                                                
                                    from ms.cp_compra c,
                                         ms.cp_compra_item ci,
                                        (select id_empresa, id_cardex_item, id_item, id_categoria, 
                                                custo_anterior, custo_operacao, custo_resultante,
                                                qtde_anterior_estoque as qtde_anterior, qtde_operacao_estoque as qtde_operacao, qtde_saldo_estoque as qtde_resultante,
                                                trunc((select max(data_created) 
                                                        from ms.cardex_item 
                                                       where id_empresa = x.id_empresa 
                                                       and id_item = x.id_item 
                                                       and id_categoria = x.id_categoria
                                                       and id_operacao = 1
                                                       and status = 'A'
                                                       and id_cardex_item < x.id_cardex_item)) as data_compra_anterior
                                          from ms.cardex_item x
                                         where status = 'A') k,
                                         ms.pessoa p,
                                         ms.empresa em,
                                         ms.tb_item_categoria ic,
                                         ms.tb_marca m,
                                         ms.tb_item i,
                                         ms.tb_categoria ca,
                                         ms.ms_operacao_sistema os,
                                         ms.tb_estoque e
                                    where c.id_empresa = ci.id_empresa
                                    and c.id_compra = ci.id_compra
                                    and ci.id_empresa = k.id_empresa
                                    and ci.id_cardex_item = k.id_cardex_item
                                    and c.id_pessoa = p.id_pessoa
                                    and c.id_empresa = em.id_empresa
                                    and ci.id_item = ic.id_item 
                                    and ci.id_categoria = ic.id_categoria
                                    and ic.id_marca = m.id_marca
                                    and ci.id_item = i.id_item
                                    and ci.id_categoria = ca.id_categoria
                                    and ci.id_empresa = e.id_empresa
                                    and ci.id_item = e.id_item
                                    and ci.id_categoria = e.id_categoria
                                    and c.id_operacao = os.id_operacao
                                    and c.id_operacao not in (10 /*Devolução de Venda*/, 45/*Entrada para analise de garantia*/, 14 /*Entrada Item em Transferencia*/, 50 /*Entrada para Reclassificac?o*/)
                                    $andSql)
                          where emp is not null )
                    where nome is not null
                    group by emp,
                             numero_nota,
                             data_emissao,
                             data_entrada,
                             cnpj,
                             nome,
                             cod_item,
                             descricao,
                             marca
                    order by emp ";

            $conn = $em->getConnection();
            $stmt = $conn->prepare($sql);
            
            $stmt->execute();
            $results = $stmt->fetchAll();

            $hydrator = new ObjectProperty;
            $hydrator->addStrategy('anterior_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_x_anterior_valor', new ValueStrategy);
            $hydrator->addStrategy('ope_x_anterior_idx', new ValueStrategy);
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
