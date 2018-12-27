<?php

gila::contentInit('page', function(&$table) {
	unset($table['fields']['commands']);
});
gila::contentInit('post', function(&$table) {
	unset($table['fields']['commands']);
});

gila::action('admin','content',function(){
	$type = router::get('type',1);
	if(!isset(gila::$content[$type])) {
		view::renderAdmin('404.php');
		return;
	}
	if($type != null) {
		$src = explode('.',gila::$content[$type])[0];
		view::set('table', $type);
		view::set('tablesrc', $src);
		if(in_array($type,['page_'])) {
			view::renderAdmin('admin/content.php');
		} else {
			view::renderAdmin('content-vue.php','content-vue');
		}
	} else if(gila::hasPrivilege('admin')) view::renderAdmin('admin/contenttype.php');

});

gila::action('cm','edit_form',function(){
	global $db;
	$pnk = new gTable(router::get("t",1));
	$fields = $pnk->fields('edit');
	if($id = router::get("id",2)) {
		$w = ['id'=>$id];
		$ql = "SELECT {$pnk->select($fields)} FROM {$pnk->name()}{$pnk->where()};";
		$res = $db->get($ql)[0];
		echo gForm::html($pnk->getFields('edit'),$res);
	} else {
		echo gForm::html($pnk->getFields('edit'));
	}
	
});

gila::action('cm','empty_form',function(){
	$pnk = new gTable(router::get("t",1));
	$id = new gTable(router::get("id",2));
	echo gForm::html($pnk->getFields('create'),$pnk->getEmpty());
});

gila::action('cm','select_row',function(){
    global $db;
    $pnk = new gTable(router::get("t",1));
    $fields = $pnk->fields();
    $ql = "SELECT {$pnk->select($fields)} FROM {$pnk->name()}{$pnk->where($_GET)} LIMIT 5;";
    $res = $db->query($ql);
    $thead = '';
    $html = '';
    while($r = mysqli_fetch_row($res)) {
        if($thead=='') $thead='<tr><th>'.implode('<th>',$pnk->getTable()['tool']['addfrom'][1]);
        $html .= '<tr class="select-row" data-id="'.$r[0].'"><td>'.implode('<td>',$r);
    }
    $totalRows = $db->value("SELECT COUNT(*) FROM {$pnk->name()}{$pnk->where($_GET)};");
    echo '<input placeholder="search"><input id="selected-row" value=""><table class="g-table">'.$thead.$html.'</table>'.$totalRows.' results found';
});

gila::route('widgets',function(){
	view::render("widgets.php","content-vue");
	exit;
});
