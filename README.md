# Stickers_PlusPlus  
表情贴纸增强插件，理论上适用于所有**存在纯文本编辑模式且支持BBcode/Markdown并支持图片外链**的网站，   
目前在**S1论坛实测除移动版快捷回复模式**均兼容；  在**某四个论坛实测所有模式均完全正常**；  
[更新记录](#%E6%9B%B4%E6%96%B0%E8%AE%B0%E5%BD%95)  

## 安装脚本  
[Github](https://github.com/HazukiKaguya/Stickers_PlusPlus/raw/master/Stickerspp.user.js)  
[GreasyFork](https://greasyfork.org/zh-CN/scripts/448465)  

## 赞助  
如果你喜欢这个插件，可以用以下链接试用Vultr来赞助我的云同步账号服务器/图床服务器的费用。  
[Refer Vultr.com and earn $10 per paid signup](https://www.vultr.com/?ref=7365869)  
[Tell A Friend about Vultr and Earn up to $35 for referring clients!](https://www.vultr.com/?ref=9023177-8H)  

## 功能一览

### 实时HTML编辑模式
![image](https://user-images.githubusercontent.com/35645329/182267648-8a4133ed-52b4-49f1-83df-2006bc868109.png)

### 自由选择启用在线表情贴纸源

![image](https://user-images.githubusercontent.com/35645329/181614422-8c38e8ee-3465-4ef7-8d2e-862c692230b8.png)

### 自由选择启用本地贴纸源

![image](https://user-images.githubusercontent.com/35645329/181614504-4e1f9011-c946-4d11-8048-1117ee52a4a8.png)

### 自由增删改查自定义贴纸

![image](https://user-images.githubusercontent.com/35645329/181614559-18989e99-3a28-49fc-812d-5168f9112ad1.png)

### 随机表情贴纸

![image](https://user-images.githubusercontent.com/35645329/181614666-0d15372e-8f5a-4141-9e64-962a0f9b1240.png)

### 文本区域粘贴直接上传

![image](https://user-images.githubusercontent.com/35645329/181614729-893c20a7-edee-4cbe-b0d1-dce57c435b60.png)

### 自定义贴纸等配置云同步

![image](https://user-images.githubusercontent.com/35645329/181615828-7b608d23-71ab-4b0c-857a-3907e97a4aa0.png)

### 可随意拖动&更换的看板娘，且支持点击看板娘上传图片

![image](https://user-images.githubusercontent.com/35645329/181615143-a205e0cf-369d-494f-85b4-1fe515002716.png)

### 丰富的个性化设置

![image](https://user-images.githubusercontent.com/35645329/181615281-cc308254-7539-4e86-839a-35d277af2e00.png)


## 一些教程：

### 云同步功能逻辑图解：
![avatar](https://p.inari.site/guest/22-07/03/62c15908556ee.png)   
【云】按钮显然是云同步功能，【令】按钮是登录功能，因为云同步实现并使用了自己的一套用户系统。  
![image](https://user-images.githubusercontent.com/35645329/181616175-8e7421f8-c8a4-4c97-8a54-7a4ac1df7700.png)   
![image](https://user-images.githubusercontent.com/35645329/181616224-4fa77143-415e-4c40-aede-ba6b522d52a6.png)   
未登录状态云同步提醒【未找到有效Token，请先登录！】  
登录态过期云同步提醒【Token已失效，请重新登录！】  
**注册与登录系统。**   
![image](https://user-images.githubusercontent.com/35645329/181616835-5ee3deb9-bfb4-4d51-92ef-c69f9125422f.png)  
![image](https://user-images.githubusercontent.com/35645329/181617039-f939ac19-e857-4c28-8361-bddc4d38fb76.png)  
![image](https://user-images.githubusercontent.com/35645329/181616930-1838e190-0f37-48ba-bd30-1f7087f8bdb2.png)  
![image](https://user-images.githubusercontent.com/35645329/181616711-c3a1081e-187f-475b-a296-b77b4444e21e.png)    
![image](https://user-images.githubusercontent.com/35645329/181616778-1eafda95-2e51-46cb-a969-e062f7dbd781.png)
云同步功能浅显易懂就不多加介绍了。  


### 删改指定自定义贴纸功能逻辑图解：
![avatar](/img/update042.png)

### 收藏随机贴纸教程：
![avatar](/img/st026.webp)

### 在[手机喵拉](https://m.miaola.info)上使用【[KF表情增强插件*改](https://github.com/HazukiKaguya/KFOL_Stickers)】（也可以让你不安装油猴直接在miaola用这个脚本，感谢喵拉佬）

首先在[这里](https://github.com/HazukiKaguya/KFOL_Stickers/blob/master/es6_KfStickers.user.js) 复制插件的全部代码，然后点开手机喵拉的设置里，保证设置里的增强插件是关闭的，然后勾选执行自定义脚本，在详细设置里点击添加脚本，把复制的代码粘贴到点击后弹出的文本框，点击这个二级菜单的保存后，会有弹窗，按确认。然后再点击助手设置这个一级菜单的保存。如图
![avatar](/img/mbst.webp)

pc版喵拉同理，除了gui布局外交互逻辑完全一样

## 更新记录
2.0.2   实时编辑模式直接插入来自论坛的upload文件，修复若干bug。
2.0.0   为不支持所见即所得模式的论坛添加实时编辑模式，修复若干bug。  
1.99    支持直接在【所见即所得模式】下插入表情，支持markdown语法，修复若干bug。
1.42    代码重构，分离function，为下一个大版本的更新做准备，修复若干bugs。
1.4.0   增加在线表情商店，重写个性化设置逻辑，修复bugs  
1.3.9   表情贴纸组数据源分离，大量操作逻辑重写。请注意，这是一个1.4.0版本的前置更新   
1.3.0   更新点击看板娘上次图片，更新看板娘可拖拽   
1.2.0   fix some bugs   
1.1.4   右下角看板娘与预览图大小自定义   
1.1.2   优化文本区域粘贴，减少提示次数   
1.1.0   图片文本区域粘贴上传/选择上传功能实装   
1.0.5   更新调用的api地址，优化强提醒文案，优化云同步/账号操作逻辑，同步贴纸时，如果数据为空，则取消同步。    
1.0.0   自定义表情贴纸云同步功能上线，至此基础功能均已完成，故版本号跳到1.0.0。  
0.4.12  去除【图文】区，原【图文】区自定义图文功能移动到【快捷】区，追加贴吧表情url在资源区默认显示  
0.4.11  在论坛资源区，对于表情贴纸增强插件所属域名的图片，直接显示，而不是显示【请手动点击打开本图片】  
0.4.10  增加新域名  
0.4.9   修复自定义贴纸序列查询的bug。  
0.4.8   优化自定义贴纸域名过滤正则，更新自定义贴纸序列查询。  
0.4.7   增加新域名  
0.4.6   ASCII画支持从主线版中去除，移至dev分支。  
0.4.5   增加code区域AA画适配。对PC版直接使用系统自带MS PGothic字体展示AA画，请自行下载字体。对移动版使用外部MS PGothic字体。  
0.4.3   自定义贴纸现在带【?num=x】后缀了，x为此贴纸在自定义贴纸中的序号,方便删改操作（点击想要删除的贴纸，看x是多少，删除、更改时填写的序号就是多少）。  
0.4.2   增加删改指定自定义贴纸功能。相比Dev分支，删改自定义贴纸代码重构，删除指定自定义贴纸功能由[改]按钮移到[删]按钮。  
0.4.0   增加替换指定自定义贴纸功能，与删除指定自定义贴纸功能同按钮，此按钮名改为[改]（Dev分支）  
0.3.9   增加删除指定自定义贴纸功能，改变按钮名称（Dev分支）  
0.3.8   自定义贴纸导入功能正则规则优化  
0.3.7   小企鹅追加  
0.3.6   修改颜文字分组为绘文字+颜文字分组（增加绘文字，微调颜文字顺序）；增加图文分组（目前就一个，后续增加贴纸为热更新，计划更新的贴纸使用透明1px图片代替，后续服务端更新即可，无需更新脚本）  
0.3.0   扩充随机表情贴纸池  
0.2.9   恢复LL分组，微调CSS样式  
0.2.8   增加暹罗猫小红豆贴纸分组，移除LL分组，原LL分组内容移到常用栏  
0.2.6   增加随机表情贴纸分组  
0.2.5   实验性功能，请自行更新。通过引入外部js，增加快捷上传图片/想要添加的本地表情到Pigeon Net Pics Hosting，请使用history寻找上一个版本来安装, 或者在前面的油猴注释部分增加这段：// @require     https://sticker.inari.site/picsup.js  
0.2.4   进一步优化表情贴纸分组  
0.2.3   精简表情分组，增加S1麻将脸表情分组  
0.2.2   change ui;fix bugs;添加导出自定义贴纸功能，方便多设备同步（请自行避免重复贴纸地址，重复贴纸检测还没写）  
0.2.1   add some stickers  
0.2.0   更新使用了喵拉布丁的部分优化代码  
0.1.2   专门为admin的某贴做了个替换规则（滑稽）  
0.1.1   加入了清理自定义贴纸功能，改变了添加删除按钮的布局。  
0.1.0   重写自定义贴纸功能，使用es6语法。  
0.0.8   部分代码更新优化为ES6语法，增加实验性添加自定义贴纸功能（非es6），这是一个临时的添加自定义方案（经过精简的eddie32佬的5.2.1代码）。  
0.0.7   修复伪中国语表情包的部分问题，更换图源，增加了一些快捷BBcode  
0.0.6   BugFix. 表情贴纸旧域名替换为新域名的功能现在仅对<img>进行操作，避免因为修改innerHTML造成事件绑定失效,导致导致无法买贴等问题。  
0.0.5   更改表情贴纸域名，增加表情贴纸旧域名替换为新域名的功能  
0.0.4   url添加kfmax，优化注释；  
0.0.3   贴纸更新贴吧，微博等；  
0.0.2   贴纸更新eddie32佬的伪中国语和流行（直接使用eddie32源）；  
0.0.1   替换失效贴纸，常用替换为小日向雪花，bilibili替换为林大B
