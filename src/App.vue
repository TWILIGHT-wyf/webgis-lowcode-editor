<script setup lang="ts">
import headerNav from './components/headerNav.vue'
</script>


  <template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <headerNav/>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main><router-view/></el-main>
      </el-container>
    </el-container>
  </div>
</template>



<style scoped></style>
