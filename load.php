<?php

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

gila::route('path',function(){
	echo var_export($_POST);
	echo json_encode($_POST,JSON_PRETTY_PRINT);
	exit;
});
