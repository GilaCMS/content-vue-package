<?=view::css('lib/pnk/pnk.css')?>
<?=view::cssAsync('lib/select2/select2.min.css')?>

<?=view::script('lib\jquery\jquery-3.3.1.min.js')?>
<?=view::script('lib\select2\select2.min.js','async')?>
<?=view::script('lib\vue\vue.min.js')?>

<script src="lib/CodeMirror/codemirror.js"></script>
<link rel="stylesheet" href="lib/CodeMirror/codemirror.css">
<style>.CodeMirror{max-height:150px;border:1px solid var(--main-border-color);width:100%}</style>
<script src="lib/CodeMirror/javascript.js"></script>
<?=view::script("lib/tinymce/tinymce.min.js")?>

<?=view::script('src/core/assets/admin/media.js')?>
<?=view::script('src/content-vue/table.js');?>
<?=view::script('src/content-vue/lang/'.gila::config('language').'.js');?>
<?=view::script('src/core/assets/admin/listcomponent.js');?>

<style>
.g-form>div:nth-child(1){
    display:grid;
    grid-template-columns: repeat(auto-fit,minmax(480px,1fr));

}

.g-form>div:nth-child(1)>div{
    margin: 3px 0px;
}
.g-form label{
    padding: 6px;
    margin: 6px;
    font: 14px  Arial;
    font-weight: bold;
}
.edititem{
    border: 1px solid lightgrey;
    border-left: 4px solid lightgreen;
    padding:0.5em;
    padding-left:1.5em;
}
.edititem .pnk-table {
    margin-top:2em;
}
.g-form{
    margin:1em 0;
}

.pnk-table .pnk-table{
    border: 1px solid lightgrey;
    border-left: 4px solid lightgreen;
    margin-top:2em;
}
.pnk-table-head{
    margin:0.5em 0;
}
.pnk-table .com-btn {
    cursor: pointer;
    opacity: 0.6;
}
.pnk-table .com-btn:hover {
    opacity: 1;
}
.type-tinymce,.type-textarea{grid-column:1/-1}
.mce-tinymce.mce-container.mce-panel{display:inline-block}

</style>

<?php
    $pnk = new gTable($table);
    $t = $pnk->getTable();
?>

<div id="vue-table">
    <pnk-vue gtype="<?=$table?>" gtable="<?=htmlspecialchars(json_encode($t))?>" gfields="<?=htmlspecialchars(json_encode($pnk->fields('list')))?>"></pnk-vue>
</div>

<script>

cmirror=new Array()
mce_editor=new Array()

app = new Vue({
    el:"#vue-table"
})


<?php
$pages_path = [];
$templates = [];

$pages_path[] = view::getThemePath().'/pages/';
if(view::$parent_theme) $pages_path[] = 'themes/'.view::$parent_theme.'/templates/';
$pages_path = array_merge($pages_path, gila::packages());
$pages_path[] = 'src/core/templates/';
foreach($pages_path as $path) {
    if(file_exists($path)) {
      $pages = scandir($path);
      foreach ($pages as $page) if($page[0]!='.'){
        $templates[] = [
          'title'=>$page, 'url'=>$path.$page
          ];
      }
    }
}
?>
g_tinymce_options.templates = <?php echo json_encode((isset($templates)?$templates:[])); ?>;

base_url = "<?=gila::config('base')?>"
g_tinymce_options.document_base_url = "<?=gila::config('base')?>"



g.dialog.buttons.select_path = {
    title:'Select',fn: function(){
        let v = g('#selected-path').attr('value')
        if(v!=null) g('[name=p_img]').attr('value', base_url+v)
        g('#media_dialog').parent().remove();
    }
}
g.dialog.buttons.select_path_post = {
    title:'Select', fn: function() {
        let v = g('#selected-path').attr('value')
        if(v!=null) input_filename(base_url+v);
        g('#media_dialog').parent().remove();
    }
}
g.dialog.buttons.select_row_source = {
    title:'Select', fn: function() {
        let v = g('#selected-row').attr('value')
        if(v!=null) g(input_select_row).attr('value', v);
        g('#select_row_dialog').parent().remove();
    }
}
function open_gallery() {
    g.post("admin/media","g_response=content&path=assets",function(gal){
        g.dialog({title:"Media gallery",body:gal,buttons:'select_path',type:'modal',class:'large',id:'media_dialog'})
    })
}
function open_gallery_post() {
    g.post("admin/media","g_response=content&path=assets",function(gal){ 
        g.dialog({title:"Media gallery",body:gal,buttons:'select_path_post',type:'modal',class:'large',id:'media_dialog'})
    })
}
function open_select_from_table(t) {
    g.post("admin/content/"+t,"g_response=content",function(gal){ 
        g.dialog({title:"Media gallery",body:gal,buttons:'select_path_post',type:'modal',class:'large',id:'media_dialog'})
    })
}
function open_select_row(mpi,table) {
    input_select_row = mpi;
    g.post("cm/select_row/"+table,"g_response=content&path=assets",function(gal){
        g.dialog({title:__m('_gallery'),body:gal,buttons:'select_row_source',type:'modal',id:'select_row_dialog',class:'large'})
    })
}

g.click(".select-row",function(){
   g('.select-row').removeClass('g-selected');
   g(this).addClass('g-selected');
   g('#selected-row').attr('value',this.getAttribute('data-id'))
})


</script>
