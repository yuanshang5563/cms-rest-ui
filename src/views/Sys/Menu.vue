<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.menuName" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
        <el-button size="mini" type="primary" @click="findTreeData()">{{$t('action.search')}}</el-button>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.add')" perms="ROLE_CORE_MENU_ADD_EDIT" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格树内容栏-->
    <el-table :data="tableTreeDdata" stripe size="mini" style="width: 100%;"
      v-loading="loading" :element-loading-text="$t('action.loading')">
      <el-table-column prop="coreMenuId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <table-tree-column prop="menuName" header-align="center" treeKey="coreMenuId" parentKey="parentCoreMenuId" width="250" label="名称"></table-tree-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType == '0'" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType == '1'" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType == '2'" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentMenuName" header-align="center" align="center" width="120" label="上级菜单"></el-table-column>
      <el-table-column prop="menuUrl" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="菜单URL"></el-table-column>
      <el-table-column prop="permission" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="授权标识"></el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="220" :label="$t('action.operation')">
        <template slot-scope="scope">
          <kt-button :label="$t('action.edit')" perms="ROLE_CORE_MENU_ADD_EDIT" @click="handleEdit(scope.row)"/>
          <kt-button :label="$t('action.delete')" perms="ROLE_CORE_MENU_DEL" type="danger" @click="handleDelete(scope.row)"/>
          <kt-button :label="$t('action.view')" perms="ROLE_CORE_MENU_EDIT_VIEW" @click="handleView(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :title="dialogTitle" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" 
        label-width="80px" :size="size" style="text-align:left;">
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="dataForm.menuType" :disabled="viewFlag">
            <el-radio label="0">目录</el-radio>
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.menuType] + '名称'" prop="menuName">
          <el-input v-model="dataForm.menuName" :placeholder="menuTypeList[dataForm.menuType] + '名称'" :readonly="viewFlag"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentMenuName">
            <popup-tree-input :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentMenuName==null||dataForm.parentMenuName==''?'顶级菜单':dataForm.parentMenuName" 
              :nodeKey="''+dataForm.parentCoreMenuId" :currentChangeHandle="handleTreeSelectChange" :disabled="viewFlag">
            </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType == '2'" label="授权标识" prop="permission">
          <el-input v-model="dataForm.permission" placeholder="如: ROLE_CORE_ROLE_EDIT_VIEW" :readonly="viewFlag"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType == '1'" label="菜单路由" prop="menuUrl">
          <el-row>
            <el-col :span="22">
                <el-input v-model="dataForm.menuUrl" placeholder="菜单路由" :readonly="viewFlag"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
                <el-tooltip placement="top" effect="light" style="padding: 10px;">
                  <div slot="content">
                    <p>URL格式：</p>
                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType !='2'" label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" :disabled="viewFlag"></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.menuType != '2'" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="viewFlag" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()" v-show="!viewFlag">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      size: "small",
      loading: false,
      filters: {
        menuName: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      editLoading: false,
      menuTypeList: ["目录", "菜单", "按钮"],
      dialogTitle: "",
      viewFlag: false,
      dataForm: {
        coreMenuId: 0,
        menuType: "0",
        menuName: "",
        parentCoreMenuId: 0,
        parentMenuName: "",
        menuUrl: "",
        permission: "",
        orderNum: 0,
        icon: ""
      },
      dataRule: {
        menuType: [{ required: true, message: "菜单类型不能为空", trigger: "blur" }],
        menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "menuName",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.menu.findCoreMenuTree({menuName:this.filters.menuName}).then(res => {
        this.tableTreeDdata = res.data;
        this.popupTreeData = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        coreMenuId: 0,
        menuName: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.viewFlag = false;
      this.dataForm={
        coreMenuId: 0,
        menuType: "0",
        menuName: "",
        parentCoreMenuId: 0,
        parentMenuName: "",
        menuUrl: "",
        permission: "",
        orderNum: 0,
        icon: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.viewFlag = false;
      let _this = this;
      this.$api.menu.find({coreMenuId:row.coreMenuId}).then(res => {
        Object.assign(_this.dataForm, res.data);
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.menu.del({coreMenuId:row.coreMenuId}).then(res => {
          this.findTreeData();
          this.$message({ message: "删除成功", type: "success" });
        });
      });
    },
     // 显示查看界面
    handleView: function(row) {
      this.dialogVisible = true;
      this.dialogTitle = "查看";
      this.viewFlag = true;
      let _this = this;
      this.$api.menu.find({coreMenuId:row.coreMenuId}).then(res => {
        Object.assign(_this.dataForm, res.data);
      });
    },   
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentCoreMenuId = data.coreMenuId;
      this.dataForm.parentMenuName = data.menuName;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.menu.saveOrEdit(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.dialogVisible = false;
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.findTreeData();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style scoped>
</style>