

Vue.component('pnk-vue', {
    template: '<div class="pnk-table">\
        <div v-if="edititem==0" class="pnk-table-head">\
            <label class="g-label" v-html="table.title"></label>\
            <div v-if="table[\'search-box\']" style="position:relative;display:inline-block" class="search-box">\
                <input v-model="search" class=" g-input" @keypress="if($event.keyCode || $event.which == \'13\') runsearch()" value="" type="text">\
                <svg height="24" width="24" style="position:absolute;right:8px;top:8px" viewBox="0 0 28 28"><circle cx="12" cy="12" r="8" stroke="#929292" stroke-width="3" fill="none"></circle><line x1="17" y1="17" x2="24" y2="24" style="stroke:#929292;stroke-width:3"></line></svg>\
            </div>\
            <span v-if="table.tools" style="float:right">\
                <span v-for="(tool,itool) in table.tools" @click="runtool(tool,$event)" class="g-btn" style="margin-right:6px" v-html="tool_label(tool)"></span>\
            </span>\
        </div>\
        <div v-if="edititem>0" class="edititem">\
            <span v-if="edititem>0" class="btn" @click="edititem=0"><i class="fa fa-chevron-left" aria-hidden="true"></i></span> \
            <label class="g-label" v-html="table.title"></label>\
            <form :id="name+\'-edit-item-form\'" class="g-form">\
                <div v-html="edit_html"></div>\
                <div>\
                    <a class="btn btn-primary" @click="update()" v-html="word(\'Update\')"></a>\
                    <a class="btn btn-white" @click="edititem=false" v-html="word(\'Cancel\')"></a>\
                </div>\
            </form>\
        </div>\
        <pnk-vue v-if="edititem>0" v-for="(child,childkey) in table.children" :gtype="childkey" gchild=1 :gtable="JSON.stringify(child.table)" :gfields="JSON.stringify(child.list)" :gfilters="\'&amp;\'+child.parent_id+\'=\'+edititem"></pnk-vue>\
 \
        <table v-if="edititem==0 || child==1" class="" cur-page="1"  group-by="">\
        <thead>\
            <tr>\
                <!--th v-if="table.bulk_actions" style="width:28px;">\
                    <i class="fa fa-square-o bulk_checkbox" aria-hidden="true"></i>\
                </th-->\
                <th v-for="ifield in data.fields" :col="ifield" class="sorting">\
                    <!--i class="pnk-icon pnk-sorti fa fa-sort" :col="ifield"></i-->\
                    <span v-html="field_label(ifield)"></span>\
                </th>\
                <th v-if="table.commands">\
                </th>\
            </tr>\
        </thead>\
        <tbody>\
            <tr v-for="(row,irow) in data.rows" :row-id="row.id">\
                <!--td v-if="table.bulk_actions">\
                    <i class="fa fa-square-o tr_checkbox"></i>\
                </td-->\
                <td v-for="(field,ifield) in data.fields" :col="ifield" :value="row[ifield]" class="">\
                    <span v-html="display_cell(irow,ifield)"></span>\
                </td>\
                <td v-if="table.commands">\
                    <!--span @click="edit(row[0])" class="g-btn" style="margin-right:6px" >Edit</span-->\
                    <span v-for="(com,icom) in table.commands" @click="command(com,row[0])" class="g-btn btn-white com-btn" style="margin-right:6px" v-html="command_label(com)"></span>\
                </td>\
            </tr>\
            <tr v-if="data.rows.length==0">\
                <td colspan="100">No results found</td>\
            </tr>\
        </tbody>\
        <tfoot v-if="table.pagination">\
            <tr>\
                <td colspan="100">\
                    <ul class="pagination pnk-pagination">\
                        <li v-for="p in totalPages()" class="active"><button :class="(p==page?\'g-btn\':\'\')" @click="load_page(p)" v-html="p"></button></li>\
                    </ul>\
                </td>\
            </tr>\
        </tfoot>\
    </table>\
    </div>\
    ',
    props: ['gtype','gtable','gfields','gfilters','gchild'],
    data: function(){ return {
        name: this.gtype,
        table: JSON.parse(this.gtable),
        data:{
            fields: JSON.parse(this.gfields),
            rows:[],
            totalRows:0
        },
        filters: this.gfilters,
        edititem:0,
        edit_html:"",
        search:"",
        page:1,
        type: this.gtype,
        child: this.gchild,
    }},
    updated: function() {
        let textareas
        if(this.edititem==0) return;
        
        textareas=g('.codemirror-js').all
        cmirror=[]
        for(i=0;i<textareas.length;i++) {
            x=textareas[i].name
            cmirror[x]=CodeMirror.fromTextArea(textareas[i],{lineNumbers:true,mode:'javascript'});
        }
        
        textareas=g('.tinymce').all
        mce_editor=[]
        tinymce.remove() //remove all tinymce editors
        for(i=0;i<textareas.length;i++) {
            mce_editor[i] = textareas[i].name;
            g_tinymce_options.selector = '[name='+textareas[i].name+']'
            tinymce.init(g_tinymce_options)
        }
        if(typeof $.fn.select2 != 'undefined') $(".select2").select2();
    },
    methods: {
        load_page: function(page){
            let _data = this.data
            this.page=page
            if(typeof this.filters=='undefined') this.filters=''
            g.get('cm/list_rows/'+this.name+'?page='+page+this.filters,function(data){
                data = JSON.parse(data)
                _data.rows=data.rows
                _data.totalRows=data.totalRows
            })
        },
        command: function(com, irow) {
            pnk_command[com].fn(this,irow)
        },
        runtool: function(tool,e) {
            pnk_tool[tool].fn(this)
            e.preventDefault()
        },
        tool_label: function(tool) {
            if(typeof pnk_tool[tool]=='undefined') return _e(tool)
            return _e(pnk_tool[tool].label)
        },
        field_label: function(ifield) {
            if(typeof this.table.fields[ifield].title=='undefined') return ifield
            return this.table.fields[ifield].title
        },
        command_label: function(com) {
            if(typeof pnk_command[com]=='undefined') return com
            return '<i class="fa fa-2x fa-'+pnk_command[com].fa+'"></i>'
        },
        runsearch: function() {
            let _data = this.data
            if(typeof this.filters=='undefined') this.filters=''
            g.get('cm/list_rows/'+this.name+'?search='+this.search+this.filters,function(data){
                data = JSON.parse(data)
                _data.rows=data.rows
                _data.totalRows=data.totalRows
            })
        },
        update: function(){
            irow = this.edititem
            id_name = this.name+'-edit-item-form'
            
            form = document.getElementById(id_name)
            data = new FormData(form);
            
            for (x in mce_editor)  {
                console.log(mce_editor[x])
                data.set(mce_editor[x], tinymce.get(mce_editor[x]).getContent())
                console.log(tinymce.get(mce_editor[x]).getContent()) 
            }
            textareas=g('.codemirror-js').all
            for (x in cmirror) {
                data.set(x, cmirror[x].getValue())
                console.log( cmirror[x].getValue())
            }

            let _this = this
            g.ajax({method:'post',url:'cm/update_rows/'+this.name+'?id='+irow,data:data,fn:function(data) {
                data = JSON.parse(data)
                for(i=0;i<_this.data.rows.length;i++) if(_this.data.rows[i][0] == data.rows[0][0]){
                    console.log(i,data.rows[0])
                    _this.data.rows[i] = data.rows[0];
                    _this.$forceUpdate()
                }
            }})
            this.edititem = false
        },
        display_cell: function(irow,ifield){
            fkey = this.data.fields[ifield]
            cv = this.data.rows[irow][ifield]
            field = this.table.fields[fkey]
            dv = cv // display value
            if (typeof this.table.fields[fkey].display != "undefined") {
                return eval(this.table.fields[fkey].display)
            }
            if (typeof field.options != "undefined") if(cv!==null) {
                if (typeof field.options[cv] != "undefined") return field.options[cv]
                let resp = ''
                let csv = cv.split(',')
                for(i=0;i<csv.length;i++)  if(typeof field.options[csv[i]] != "undefined") {
                    resp += field.options[csv[i]]+'<br>'
                } else resp += csv[i]+'<br>'
                return resp
            }

            return dv
        },
        word: function(word){
            return _e(word)
        },
        totalPages: function(){
            return Math.ceil(this.data.totalRows/this.table.pagination)
        }
    },/*
    computed: {
        display_cell: function(irow,ifield){
            //if (this.fields[ifield].display!=='undefined') return "ok;"
            return this.data.rows[irow][ifield]
        }
    },*/
    mounted: function() {
        this.load_page(1)
    }
})
/*
    beforeCreate: function(){
		console.log('dfewef')
		this.pos=JSON.parse(this.value)
		this.fields=JSON.parse(this.fieldset)
		this.ivalue = this.value
    }
*/
pnk_command = Array()
pnk_tool = Array()
pnk_command['edit'] = {
    fa: "pencil",
    fn: function(table,irow){
        let _this = table
        _this.edititem = irow
        _this.edit_html = "Loading..."
        g.get('cm/edit_form/'+_this.name+'?id='+irow,function(data){
            _this.edit_html = data
            edit_item_app.$forceUpdate()
        })
    }
}

pnk_command['clone'] = {
    fa: "copy",
    fn: function(table,id) {
        let _this
        _this = table
        _this.edit_html = "Loading..."
        g.get('cm/insert_row/'+_this.name+'?id='+id,function(data){
            data = JSON.parse(data)
            _this.data.rows.unshift(data.rows[0])
        })
    }
}

pnk_command['delete'] = {
    fa: "trash-o",
    fn: function(table,id) {
        let _this = table
        let _id = id
        data = new FormData()
        data.append('id',id)
        if(confirm(_e("Delete registry?"))) g.ajax({
            url: "cm/delete?t="+_this.name,
            data: data,
            method: 'post',
            fn: function(data) {
                for(i=0;i<_this.data.rows.length;i++) if(_this.data.rows[i][0] == _id) {
                    _this.data.rows.splice(i,1)
                    //_this.$forceUpdate()
                }
            }
        });
    }
}

pnk_tool['add'] = {
    fa: "plus", label: "New",
    fn: function(table) {
        let _this
        _this = table
        _this.edit_html = "Loading..."
        g.get('cm/insert_row/'+_this.name+'?'+_this.filters,function(data){
            data = JSON.parse(data)
            if(typeof _this.data.rows=='undefined') {
                _this.data.rows = [data.rows[0]]
            } else _this.data.rows.unshift(data.rows[0])
        })
    }
}

g_tinymce_options = {
    selector: '',
    relative_urls: false,
    remove_script_host: false,
    height: 250,
    theme: 'modern',
    extended_valid_elements: 'script,div[v-for|v-if|v-model|style|class|id|data-load]',
    plugins: [
      'lists link image charmap hr anchor pagebreak',
      'searchreplace wordcount visualchars code',
      'insertdatetime media nonbreaking table contextmenu ',
      'template paste textcolor colorpicker textpattern codesample'
    ],
    toolbar1: 'styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link media image codesample',
    //templates: <?php echo json_encode((isset($templates)?$templates:[])); ?>,
    //document_base_url : "<?=gila::config('base')?>",
    //content_css: <?php echo json_encode(view::$stylesheet); //isset($content_css)?$content_css:[] ?>,
    file_picker_callback: function(cb, value, meta) {
      input_filename = cb;
      open_gallery_post();
    },
  
 }

// Translation
function _e(phrase)
{
	if(typeof lang_array!='undefined') if(typeof lang_array[phrase]!='undefined') return lang_array[phrase];
	return phrase;
}