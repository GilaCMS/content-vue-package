<?php
view::script('lib/gila.min.js');
view::script('src/core/assets/admin/media.js');
?>
<?=view::cssAsync('lib/font-awesome/css/font-awesome.min.css')?>
<?=view::cssAsync('lib/vue/vue-editor.css')?>
<?=view::script('lib/vue/vue.min.js')?>

<div style="display:grid;grid-template-columns:1fr 40px;gap:0;max-width:900px">
<?php
global $db;
$widgets = $db->gen("select * from widget where area IS NOT NULL;");
foreach($widgets as $w) {
   echo "<div>";
   $wdata = json_decode($w['data']);
   @$wdata->widget_id = $w['id'];
   view::widget_body($w['widget'],$wdata);
   echo "</div><div><button onclick='edit_widget(".$w['id'].")'>Edit</button></div>";
}

?>
</div>
<script>

//pnk_populate_tables(document);
requiredRes = [];
cmirror=new Array()

g.dialog.buttons.update_widget = {title:'Update',fn:function(){
    textareas=g('.codemirror-js').all
    for(i=0;i<textareas.length;i++) {
        textareas[i].value=cmirror[i].getValue()
    }
    let fm=new FormData(g.el('widget_options_form'))

   g.ajax({url:'admin/update_widget?g_response=content',method:'POST',data:fm,fn:function(data){
       g('#gila-popup').parent().remove();
       location.reload()
//      data = JSON.parse(data)
//      tr = $('tr[row-id='+data.rows[0][0]+']');
//      tr.replaceWith( PNK.load_rows( 'src/core/tables/widget', data ) );
//      tr.attr("class","main-row");
    }})
}}

function edit_widget(id) {
   href='admin/widgets?id='+id;
   g.ajax(href,function(data){
       g.dialog({class:'lightscreen large',body:data,type:'modal',buttons:'update_widget'})
        app = new Vue({
            el: '#widget_options_form'
        })
        textareas=g('.codemirror-js').all
        for(i=0;i<textareas.length;i++) {
            cmirror[i]=CodeMirror.fromTextArea(textareas[i],{lineNumbers:true,mode:'javascript'});
        }
        if(typeof pnk_populate_tables == 'function') pnk_populate_tables(document);
   });
};

</script>

