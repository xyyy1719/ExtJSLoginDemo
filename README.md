演示在不使用Sencha Cmd的情况下，如何一步步创建一个Login窗口。

先来看下最终效果：

![最终效果](http://upload-images.jianshu.io/upload_images/2105640-829e780b45e6939a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#####功能点
- 在网页加载时显示Loading画面。
- 在网页加载完毕后去掉Loading画面。
- 创建一个Login窗口。
- 使用ViewController来保存逻辑代码。
- 中英文语言切换。
- 显示大写键打开警告。
- 密码输入的复杂校验。

##### 准备工作
可以从github上clone准备工作完成后的项目状态：

```
git clone -b preparation https://github.com/xyyy1719/ExtJSLoginDemo.git
```

也可以按以下步骤手动一步步来操作：
- 下载Sencha Ext JS的SDK，本文中使用的是开源的GPL的6.2.0版本。
- 创建项目目录LoginDemo，具体位置视情况而定，比如tomcat就放在webapps下，http server就放在htdocs里。我使用的nodejs的serve，所以可以放在任意位置，比如D:\LoginDemo。
- 如果你也准备使用serve，请先安装nodejs，然后通过npm安装serve: 
```
npm install -g serve
```
- 在LoginDemo里创建一个子目录ext。
- 将下载好的Ext JS SDK的zip文件解压到任意目录，比如我的是D:\ext-6.2.0。
- 在D:\ext-6.2.0\build目录下找到ext-all.js文件，并将该文件复制到D:\LoginDemo\ext目录下。
- 将D:\ext-6.2.0\build\classic下的theme-triton目录和locale目录也复制到D:\LoginDemo\ext目录下。
- theme-triton是Ext JS 6.x版本新增的主题，如果喜欢用其他的主题，可以选择复制D:\ext-6.2.0\build\classic下的其他theme-xxx目录。
- locale目录里是Ext JS自带的各国语言文件，在这个Demo中我们将只使用中文和英文，所以只需要用到locale-zh_CN和locale-en两个文件，其他语言文件都可以删掉。
- 将locale-en文件更名为locale-en_US。
- 在LoginDemo目录里创建一个子目录resources，然后在resources目录里再创建一个子目录images。
- 将Demo需要用到的三张图片文件复制到images目录里：hello_world.png，zh_CN.png，en_US.png。

![hello_world.png](http://upload-images.jianshu.io/upload_images/2105640-218986156e2e75e7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![zh_CN.png](http://upload-images.jianshu.io/upload_images/2105640-fd8a076738a69212.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![en_US.png](http://upload-images.jianshu.io/upload_images/2105640-c58eadc7010ae281.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- hello_world.png是在网页加载时显示的logo，可以按意愿替换成任意其他的图片文件。
- zh_CN.png和en_US.png是显示在语言切换按钮上的小图标，我是在[FAMFAMFAM](http://www.famfamfam.com/lab/icons/flags/)上下载的。


此时的项目目录应该长这样：

![准备工作完成后的项目目录](http://upload-images.jianshu.io/upload_images/2105640-da40591007214899.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


##### 创建index.html

在LoginDemo目录下新建index.html，引入Ext JS的css和js文件

```
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Login Demo</title>
	<link rel="stylesheet" type="text/css" href="ext/theme-triton/resources/theme-triton-all.css">
</head>
<body>

	<script type="text/javascript" src="ext/ext-all.js"></script>
	
</body>
</html>
```


##### 运行serve

从终端进入LoginDemo目录， 输入：
```
serve
```
打开浏览器输入网址：http://localhost:3000/
这时打开的网页是一片空白，但从serve的输出中可以看到Ext JS的css和js已经成功加载。

![serve的输出](http://upload-images.jianshu.io/upload_images/2105640-bf3773adc9921587.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 创建app/Application.js
在LoginDemo里新建一个子目录app，并在app里创建Application.js。
- app目录将保存我们所有用Ext JS编写的js文件。
- Application.js可以理解为是Ext JS的入口程序。

![Application.js](http://upload-images.jianshu.io/upload_images/2105640-fd33f9725ca861d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在app/Application.js中输入以下代码：
```
Ext.define('LoginDemo.Application', { // (#1)
    extend: 'Ext.app.Application', // (#2)
    name: 'LoginDemo' // (#3)
});

Ext.application('LoginDemo.Application'); // (#4)
```
*(#1) Ext.define('LoginDemo.Application', {*
Ext JS也有类(Class)的概念，创建类的语法是：
```
Ext.define(className, {config});
```
在这里，我们定义了一个类，完整的类名叫LoginDemo.Application。

*(#2) extend: 'Ext.app.Application'*
如果去查看Ext JS的文档，你会发现所有的UI都是类，比如Ext.window.Window, Ext.form.Panel, Ext.button.Button等等。我们可以直接使用这些Ext JS的标准类，也可以像其他编程语言一样，通过继承的方式来创建子类，除了能使用父类的属性和方法外，还能自定义一些属性和方法。而在大多数情况下，我们都会去使用这种继承的方式来编写Ext JS的程序。
继承的语法是：
```
extend: Ext JS className
```
我们自定义的LoginDemo.Application类就是继承了Ext JS的Ext.app.Application类，如Ext JS的文档里所描述的：
> an **Ext.app.Application** represents an entire app

所以它可以理解为一个Ext JS程序的入口或主程序。

*(#3) name: 'LoginDemo'*
LoginDemo.Application的属性name是从Ext.app.Application继承而来，我们将它的值设为我们的项目名称LoginDemo。
查看Ext JS文档关于Ext.app.Application的name属性的描述：
> **name: String**
The name of your application. This will also be the namespace for your views, controllers models and stores. Don't use spaces or special characters in the name. **Application name is mandatory**.
Defaults to: ''

LoginDemo是这个项目的名称，也将作为所有自定义类的命名空间(Namespace)，即自定义类的完整类名将是namespace.className，如我们刚定义的LoginDemo.Application，LoginDemo是namespace，Application是className。在一个项目里，需要保证每一个类的完整类名是唯一的。

*(#4) Ext.application('LoginDemo.Application');*
在最后一行的这句代码将通知Ext JS来启动我们创建的LoginDemo.Application类，即我们的主程序。

##### 更新index.html
需要在index.html中引入新建的Application.js，需要注意引入的顺序，Application.js要在ext-all.js之后
```
<script type="text/javascript" src="ext/ext-all.js"></script>
<script type="text/javascript" src="app/Application.js"></script>
```
更新后完整的index.html：
```
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Login Demo</title>
	<link rel="stylesheet" type="text/css" href="ext/theme-triton/resources/theme-triton-all.css">
</head>
<body>

	<script type="text/javascript" src="ext/ext-all.js"></script>
	<script type="text/javascript" src="app/Application.js"></script>

</body>
</html>
```

刷新浏览器，网页仍是一片空白，但按F12打开开发者工具，就可以看到一些由Ext JS创建的<div>。

![由Ext JS生成的<div>](http://upload-images.jianshu.io/upload_images/2105640-2e429d2d9fd05974.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 显示Loading信息
网页加载总需要一些时间，我们当然不希望在这段时间里显示给用户一片空白，Ext JS提供了非常简便的显示Loading的方法。
编辑app/Application.js，在name: 'LoginDemo'之后新增init()方法：
```
name: 'LoginDemo',
// 新增init方法
init: function() {
    Ext.getBody().mask('Loading...');
}
```
init()顾名思义就是在Ext JS启动时执行的初始化，它会在其他Ext JS类完成加载之前执行。Ext.getBody()返回html的<body>的Ext.dom.Element实例，使用该实例的mask(message)方法可以在<body>上显示'Loading...'信息。

刷新浏览器，查看效果：

![Loading...](http://upload-images.jianshu.io/upload_images/2105640-2d8d5b6cfb761575.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

查看开发者工具，会看到Ext JS在<body>中创建了mask的<div>，在里面显示‘Loading...'。

![Loading信息的<div>](http://upload-images.jianshu.io/upload_images/2105640-92a728342a476a78.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 修改Loading信息的样式
现在看到的Loading mask是Ext JS的triton主题提供的默认样式，我们来尝试修改一下，采用我们自定义的样式。
首先来查看一下mask()方法的文档：
> **mask([msg], [msgCls]): Ext.dom.Element**
Puts a mask over this element to disable user interaction. This method can only be applied to elements which accept child nodes. Use **unmask** to remove the mask.
**PARAMETERS**
**msg** :  String *(optional)*
A message to display in the mask
**msgCls** :  String *(optional)*
A css class to apply to the msg element
**RETURNS : Ext.dom.Element**
The mask element

mask()方法还提供了第二个可选参数msgCls，允许我们应用自定义的css样式到msg element上。
尝试修改init()方法，加上第二个参数，一个目前还不存在的css class：x-loadingscreen
```
init: function() {
    Ext.getBody().mask('Loading...', 'x-loadingscreen');
}
```
刷新浏览器，查看开发者工具，找到了x-loadingscreen的位置是位于第二层的<div>，就是文档所指的msg element。

![x-loadingscreen成功添加](http://upload-images.jianshu.io/upload_images/2105640-fd70330664f5a056.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在LoginDemo目录下新建一个子目录css，在其中新建一个style.css文件，该文件将保存我们自定义的css样式。

![新建的style.css](http://upload-images.jianshu.io/upload_images/2105640-7bb3a6434bc4c2ea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改index.html，加上对style.css的引用：
```
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Login Demo</title>
	<link rel="stylesheet" type="text/css" href="ext/theme-triton/resources/theme-triton-all.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>

	<script type="text/javascript" src="ext/ext-all.js"></script>
	<script type="text/javascript" src="app/Application.js"></script>

</body>
</html>
```
现在我们来尝试把Loading...的字体放大并加粗。
编辑css/style.css，添加代码：
```
.x-mask-msg.x-loadingscreen .x-mask-msg-inner .x-mask-msg-text {
	font-size: 16px;
	font-weight: bold;
}
```
这里我们是通过css的class的层级来定位到Loading...文字所在的<div>


![定位](http://upload-images.jianshu.io/upload_images/2105640-99175091b03b2945.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

刷新浏览器，看到更改样式后的效果：

![字体放大并加粗的Loading](http://upload-images.jianshu.io/upload_images/2105640-5e4a4319314728d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 添加Logo
我们将在Loading...文字的上方添加Logo。
再看mask()方法的文档，该方法会返回一个mask element。
> **RETURNS : Ext.dom.Element**
The mask element

编辑app/Application.js，修改init()方法：
```
init: function() {
    var me = this; // (#1)
    me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen'); // (#2)
    me.loadingScreen.addCls('x-loadingscreen'); // (#3)
}
```

*(#1) var me = this*;
定义的局部变量me保存的是LoginDemo.Application实例。

*(#2) me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen');*
在LoginDemo.Application实例中新建一个成员变量loadingScreen来保存mask()方法返回的mask element。

*(#3) me.loadingScreen.addCls('x-loadingscreen');*
mask()方法返回的mask element是Ext.dom.Element实例，查文档可以找Ext.dom.Element有一个addCls()方法：
> **addCls(names , [prefix] , [suffix]) : Ext.dom.Element**
Adds the given CSS class(es) to this Element.

使用该方法对其添加自定义的css样式x-loadingscreen。

刷新浏览器，查看开发者工具，确认mask element就是第一层的<div>，之前提到的msg element就是它的子元素。

![mask element](http://upload-images.jianshu.io/upload_images/2105640-2c752fbf7a66534b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

既然要在Loading...文字上方插入Logo，其实我们就只需要在msg element的<div>之前在插入一个新的<div>来放Logo图片即可。

编辑app/Application.js，修改init()方法，在最后加上代码：
```
init: function() {
    var me = this;
    me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen');
    me.loadingScreen.addCls('x-loadingscreen');
    // 新增以下代码
    Ext.dom.Helper.insertFirst(me.loadingScreen, {
    	cls: 'x-loadingscreen-icon'
    });
}
```
这次我们使用的Ext.dom.Helper类的insertFirst()方法在mask element(即me.loadingScreen)里插入一个新的子元素，并排在子元素的第一位。

编辑css/style.css，添加Logo图片：
```
.x-loadingscreen-icon {
	background-image: url('../resources/images/hello_world.png') !important;
	height: 200px;
	width: 300px;
	margin-left:auto;
	margin-right: auto;
}
```
刷新浏览器，可以看到Logo了：

![Logo](http://upload-images.jianshu.io/upload_images/2105640-2283744bd03d3035.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

继续编辑css/style.css，添加2段代码，取消mask element和msg element的底色，使页面看上去更清楚：
```
.x-mask.x-loadingscreen {
	background-color: transparent;
}

.x-mask-msg.x-loadingscreen {
	border: none;
	background-color: transparent;
}
```
刷新浏览器，这样就干净多了：

![变干净了](http://upload-images.jianshu.io/upload_images/2105640-7879b4d5639ad42f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

附上目前Application.js和style.css的完整代码。
app/Application.js：
```
Ext.define('LoginDemo.Application', {
    extend: 'Ext.app.Application',
    name: 'LoginDemo',

    init: function() {
        var me = this;
        me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen');
        me.loadingScreen.addCls('x-loadingscreen');
        Ext.dom.Helper.insertFirst(me.loadingScreen, {
    		cls: 'x-loadingscreen-icon'
    	});
    }
});

Ext.application('LoginDemo.Application');
```
css/style.css：
```
.x-mask-msg.x-loadingscreen .x-mask-msg-inner .x-mask-msg-text {
	font-size: 16px;
	font-weight: bold;
}

.x-loadingscreen-icon {
	background-image: url('../resources/images/hello_world.png') !important;
	height: 200px;
	width: 300px;
	margin-left:auto;
	margin-right: auto;
}

.x-mask.x-loadingscreen {
	background-color: transparent;
}

.x-mask-msg.x-loadingscreen {
	border: none;
	background-color: transparent;
}
```

##### 使Loading画面消失
我们已经成功地在页面加载时生成了Loading画面，接下来就要在加载完毕后使其消失。
编辑app/Application.js，在init()方法后添加一个新方法launch()：
```
init: function() {
    // ...
}
//新增的launch()
launch: function() {
    Ext.getBody().unmask();
}
```
launch()方法是在所有页面元素加载完成后执行的方法，而unmask()就是和mask()对应的取消mask的方法。

刷新浏览器，查看效果。这取决于你的电脑速度，由于现在我们的程序还没有添加任何Ext JS的UI，所以页面的加载时间应该在毫秒级，你应该还没有看到Logo和Loading...文字，它们就消失了。
为了使Loading画面能保留一段时间再消失，我们可以使用Ext JS提供的延时任务(DelayedTask)来改写launch()方法：
```
launch: function() {
    var me = this;
    var task = new Ext.util.DelayedTask(function() {
        Ext.getBody().unmask();
    });
    task.delay(2000); // 延迟2秒执行
}
```
刷新浏览器，查看效果，可以看到Loading画面在持续了大约2秒之后突然消失。
突然消失毕竟有些突兀，为了能更优雅的退场，继续改写launch()方法：
```
launch: function() {
    var me = this;
    var task = new Ext.util.DelayedTask(function() {
        me.loadingScreen.fadeOut({
            duration: 1000,
            remove: true
        });
    });
    task.delay(2000);
}
```
我们去掉了Ext.getBody().unmask()，而是改用loadingScreen的fadeOut()方法。
loadingScreen是在init()方法中创建的成员变量，它是第一层<div>，只要将它去掉，就等于去掉了Loading画面。
loadingScreen是Ext.dom.Element实例，查看文档可以找到好几个简单的动画效果。在这里，我们使用fadeOut效果，它的两个参数也很好理解：
- duration: 1000
动画效果持续1秒。
- remove: true
动画结束后将Ext.dom.Element实例删除。

刷新浏览器，查看动画效果吧。
附上目前app/Application.js的完整代码。
```
Ext.define('LoginDemo.Application', {
    extend: 'Ext.app.Application',
    name: 'LoginDemo',

    init: function() {
        var me = this;
        me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen');
        me.loadingScreen.addCls('x-loadingscreen');
        Ext.dom.Helper.insertFirst(me.loadingScreen, {
    		cls: 'x-loadingscreen-icon'
    	});
    },

    launch: function() {
        var me = this;
        var task = new Ext.util.DelayedTask(function() {
            me.loadingScreen.fadeOut({
        		duration: 1000,
        		remove: true
        	});
        });
        task.delay(2000);
    }
});

Ext.application('LoginDemo.Application');
```

##### 创建Login窗口
接下来正式进入本次Demo的正题，创建一个Login窗口。
首先确认Login窗口显示的时间应该是在loading画面消失之后，为此我们需要在fadeOut()方法里添加以下代码：
```
me.loadingScreen.fadeOut({
    duration: 1000,
    remove: true,
    listeners: {
       afteranimate: function(el, startTime, eOpts) {
           // 在这里创建Login窗口
       }
    }
});
```
Ext JS采用的是事件驱动，几乎绝大部分类都提供了各种各样的监听事件，动画也不例外，查看Ext.fx.Anim类的文档，可以找到我们需要监听的事件：
> **afteranimate(this, startTime, eOpts)**
Fires when the animation is complete.

只要监听fadeOut()的afteranimate事件，就可以确保在动画结束后执行我们想要执行的代码。

接着可以开始创建Login窗口。
在app目录下新建子目录login，然后在其中创建Window.js文件。

![Window.js](http://upload-images.jianshu.io/upload_images/2105640-29d7a3bfa47d116a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

编辑app/login/Window.js，输入代码：
```
Ext.define('LoginDemo.login.Window', { // (#1)
	extend: 'Ext.window.Window', // (#2)
    xtype: 'login-win', // (#3)
	autoShow: true,
	height: 200,
	width: 360,
	layout: {
	    type: 'fit'
	},
	iconCls: 'fa fa-key fa-lg',// (#4)
	title: 'Login',
	closeAction: 'hide',
	closable: false,
	draggable: false,
	resizable: false,
	items: [
        // (#5)
	]
});
```
*(#1) Ext.define('LoginDemo.login.Window', {*
定义一个Login窗口的类，完整的类名是LoginDemo.login.Window。在这里我们重新提一下Ext JS类的命名规范：namespace[.folder].className。
LoginDemo是项目的namespace，Window是Login窗口的类名（类名和文件名一致），而Window,js是保存在login目录里。

*(#2) extend: 'Ext.window.Window'*
Ext JS的窗口类是Ext.window.Window，所以我们的Login窗口需要继承它。

*(#3) xtype: 'login-win'*
在定义类时，可以用xtype属性来为这个类定一个短名称，专门用来创建类实例时使用（在后面我们将看到例子），需要注意的是，xtype的值和完整的类名一样都需要保证在项目里是唯一的。

*(#4) iconCls: 'fa fa-key fa-lg'*
iconCls用来设置Window标题栏上的图标。需要提的是，Ext JS已经集成了[Font Awesome](http://fontawesome.io/)，所以我们可以直接使用。

*(#5) items: []*
像Window, Panel等UI是可以作为容器(Container)的，items其实是一个Array，可以往里面添加多个子元素，之后我们会在里面添加Login表单。

其他的属性都比较直观，我就不在这里多作解释了，有需要的话可以查看[Ext.window.Window的文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.window.Window.html)。

Login窗口类已经定义好了，接着就是要在之前监听的afteranimate事件里将它实例化，编辑app/Application.js：
```
listeners: {
    afteranimate: function(el, startTime, eOpts) {
        Ext.create({
            xtype: 'login-win'
       });
   }
}
```
还记得刚才在LoginDemo.login.Window里设置xtype: 'login-win'吗？这里就用到它了，语法就是Ext.create({xtype: xtypeValue})。当然Ext JS还提供了另外几种实例化类的方法，比如Ext.create('LoginDemo.login.Window')，还有new LoginDemo.login.Window()等，效果都是一样的。
最后，我们还需要在Application.js里注册一下我们的自定义的新窗口类，在name和init()之间加上一段代码：
```
name: 'LoginDemo',
// 新增views: []
views: [
    'LoginDemo.login.Window'
],
init: function() {
   // ...
},
```

现在可以刷新浏览器看下效果了：

![Login窗口初现](http://upload-images.jianshu.io/upload_images/2105640-362c5cf50e849191.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

附上目前app/Application.js的完整代码。
```
Ext.define('LoginDemo.Application', {
    extend: 'Ext.app.Application',
    name: 'LoginDemo',

    views: [
        'LoginDemo.login.Window'
    ],
    
    init: function() {
        var me = this;
        me.loadingScreen = Ext.getBody().mask('Loading...', 'x-loadingscreen');
        me.loadingScreen.addCls('x-loadingscreen');
        Ext.dom.Helper.insertFirst(me.loadingScreen, {
    		cls: 'x-loadingscreen-icon'
    	});
    },

    launch: function() {
        var me = this;
        var task = new Ext.util.DelayedTask(function() {
            me.loadingScreen.fadeOut({
        		duration: 1000,
        		remove: true,
        		listeners: {
        			afteranimate: function(el, startTime, eOpts) {
                        Ext.create({
                            xtype: 'login-win'
                        });
        			}
        		}
        	});
        });
        task.delay(2000);
    }
});

Ext.application('LoginDemo.Application');
```

##### 添加Login表单
Login窗口的架子已经搭好了，接着就往里面添加表单了。登录的表单比较简单，只有两个输入框：用户名和密码。
编辑app/login/Window.js，添加items[]里的代码：
```
    items: [
		{
			xtype: 'form', // (#1)
			bodyPadding: 15,
			defaults: { // (#2)
				xtype: 'textfield', // (#3)
				anchor: '100%',
				labelWidth: 70,
				allowBlank: false, // (#4)
				msgTarget: 'side' // (#5)
			},
			items: [ // (#6)
				{
					name: 'userName',
					fieldLabel: 'User Name', // (#7)
					minLength: 3, // (#8)
					maxLength: 25,
					vtype: 'alphanum' // (#9)
				},
				{
					inputType: 'password', // (#10)
					name: 'password',
					fieldLabel: 'Password',
                    minLength: 6,
					maxLength: 20
				}
			]
		}
	]
```
先刷新浏览器看下效果，然后再解释代码。

![Login表单](http://upload-images.jianshu.io/upload_images/2105640-4a5979e7b08c5b57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

*(#1) xtype: 'form'*
'form'是Ext.form.Panel的xtype，对于这个Demo里的Login表单，可以不用创建一个自定义的类，在这里我们就直接实例化Ext JS标准的表单类Ext.form.Panel。
之前我们介绍了实例化类的几种方法，我们在实例化Login窗口类时，使用的是Ext.create({xtype: 'login-win'})。而在这里我们看来的是另一种类似的格式items: [{xtype: 'form'}]。当在items: []中使用xtype的方式实例化类时可以省略Ext.create()。

*(#2) defaults: *
我们的表单里会有用户名和密码两个输入框，它们会有一些相同的属性设置，可以使用defaults来把这些相同的设置写在一起，使代码更简洁。

*(#3) xtype: 'textfield'*
用户名和密码这两个输入框在Ext JS里也有对应的UI类：Ext.form.field.Text，对应的xtype值是textfield。

*(#4) allowBlank: false*
用户名和密码的输入都要求不能为空，textfield提供了对应的开关设置allowBlank。

*(#5) msgTarget: 'side'*
我们可以对表单的输入做各种验证，比如allowBlank的输入非空验证。msgTarget属性是用来设置当验证出现错误时，比如密码没有输入，错误提示信息将显示在哪里。我个人比较喜欢用side，即在输入框的旁边显示一个红色的感叹号，当鼠标悬停时会显示具体的报错信息。除了side，Ext JS还提供了另外几种选择，有兴趣的可以查看[msgTarget文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.form.field.Text.html#cfg-msgTarget)，自己尝试一下。

*(#6) items:*
这里的items和Window的items意思是一样的，Login表单作为子元素放在Login窗口的items里，那么用户名和密码输入框也同样作为Login表单的子元素，放在Login表单的items里。

*(#7) fieldLabel: 'User Name'*
显示在输入框之前的标签。

*(#8) minLength: 3*
minLength设置的是最少输入的字符数量，相对的maxLength设置的是最多可以输入几个字符。它们和allowBlank一样，都是用于对输入进行验证。
在这里，我们设置用户名的长度在3到25个字符之间，而密码的长度在6到20个字符之间。

*(#9) vtype: 'alphanum'*
vtype是Ext JS提供另一种对输入的高级验证方式，并已经提供了几种预设的类型，比如这里我们用到的alphanum表示用户名的输入必须是字符或数字，用户无法输入其它特殊字符。

*(#10) inputType: 'password'*
这个设置可以让输入的密码以*来显示。

更多的属性设置和解释请查看对应的[Ext.form.Panel文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.form.Panel.html)和[Ext.form.field.Text文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.form.field.Text.html)。

##### 添加提交按钮
输入框已经完成，现在我们需要创建一个提交按钮。
编辑app/login/Window.js，在Login表单的items后加上一段代码：
```
Ext.define('LoginDemo.login.Window', {
	// ...
    items: [
		{
			xtype: 'form',
			// ...
			items: [
				// ...
			],
            // 新增以下代码
			dockedItems: [
				{
					xtype: 'toolbar', // (#1)
					dock: 'bottom', // (#2)
					items: [
						'->', // (#3)
						{
							xtype: 'button', // (#4)
							iconCls: 'fa fa-sign-in fa-lg',
							text: 'Submit',
							formBind: true // (#5)
						}
					]
				}
			]
		}
	]
});
```
刷新浏览器，看下效果：

![Submit按钮](http://upload-images.jianshu.io/upload_images/2105640-080d36d915d41d37.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

*(#1) xtype: 'toolbar'*
toolbar是Ext.toolbar.Toolbar的xtype，我们会将Submit按钮放在工具栏上。

*(#2) dock: 'bottom'*
注意到工具栏是放在dockedItems里的，而不是之前用过的items。而dock属性是用来设置工具栏的具体位置，这里我们选择放在底部，当然你也可以尝试顶部以及左右两侧。

*(#3) '->'*
工具栏作为容器也可以使用items来放置子元素。
'->'是Ext.toolbar.Fill的简写方式，在它之后添加的元素都将在工具栏上右对齐。

*(#4) xtype: 'button'*
button就是Ext.button.Button的xtype

*(#5) formBind: true*
注意到Submit按钮是灰色的吗？这是因为我们开启了formBind属性，当值为true时，Submit按钮只会在输入信息通过验证的情况才能被点击。请尝试在用户名里输入3-25个字符，在密码里输入6-20个字符，看看Submit按钮是否可以点击了。

附上目前app/login/Window.js的完整代码。
```
Ext.define('LoginDemo.login.Window', {
	extend: 'Ext.window.Window',
    xtype: 'login-win',
	autoShow: true,
	height: 200,
	width: 360,
	layout: {
		type: 'fit'
	},
	iconCls: 'fa fa-key fa-lg',
	title: 'Login',
	closeAction: 'hide',
	closable: false,
	draggable: false,
	resizable: false,
    items: [
		{
			xtype: 'form',
			bodyPadding: 15,
			defaults: {
				xtype: 'textfield',
				anchor: '100%',
				labelWidth: 70,
				allowBlank: false,
				msgTarget: 'side'
			},
			items: [
				{
					name: 'userName',
					fieldLabel: 'User Name',
					minLength: 3,
					maxLength: 25,
					vtype: 'alphanum'
				},
				{
					inputType: 'password',
					name: 'password',
					fieldLabel: 'Password',
                    minLength: 6,
					maxLength: 20
				}
			],
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [
						'->',
						{
							xtype: 'button',
							iconCls: 'fa fa-sign-in fa-lg',
							text: 'Submit',
							formBind: true
						}
					]
				}
			]
		}
	]
});
```

##### 点击Submit按钮
在正式的程序中当点击Submit按钮后，程序应该将用户名和密码发送到后台程序进行进一步的校验和处理并返回结果。但在这个Demo里我们将不会涉及后台程序，所以当点击Submit按钮后，我们就简单的显示一条信息在界面上。
Ext JS采用的是事件驱动，几乎绝大部分类都提供了各种各样的监听事件，之前我们已经接触到了动画的afteranimate事件，对于按钮来说，点击也有对应的事件。
查看[Ext.button.Button的文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.button.Button.html)，找到click事件。
> **click(this, e, eOpts)**
Fires when this button is clicked, before the configured handler is invoked. Execution of the handler may be vetoed by returning false to this event.

编辑app/login/Window.js，为Submit按钮添加监听click事件的代码：
```
{
    xtype: 'button',
    iconCls: 'fa fa-sign-in fa-lg',
    text: 'Submit',
    formBind: true,
    // 新增click事件监听
    listeners: {
        click: function(button, event, eOpts) {
	        Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
	    }
    }
}
```
刷新浏览器，点击Submit按钮。

![点击Submit按钮](http://upload-images.jianshu.io/upload_images/2105640-3cac5388eb6ade49.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Ext.Msg.alert(title, message)是Ext JS提供显示消息对话框的语法，还有更多的对话框显示方式请参见[Ext.window.MessageBox文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.window.MessageBox.html)。

由于Button的click事件是一个使用非常频繁的事件，Ext JS为此对click事件提供了一种简写的方式。
查看Ext.button.Button的handler属性的文档：
> **handler: Function / String**
A function called when the button is clicked (can be used instead of click event).

我们来改写一下：
```
{
    xtype: 'button',
    iconCls: 'fa fa-sign-in fa-lg',
    text: 'Submit',
    formBind: true,
    // 将listeners -> click简写成handler
    handler: function(button, event) {
	    Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
    }
}
```

##### 回车按键的监听
很多系统都提供了这样的一个细节功能，就是当用户输入用户名或密码后，如果按了回车键，系统就默认认为用户按了Submit按钮，省去了用户手动点击按钮的过程。
Ext JS实现这个功能也很方便，其实就是对用户名和密码的输入框(textfield)添加对应的按键监听事件。
在文档中我们找到了对应的事件specialKey：
> **specialkey(this, e, eOpts)**
Fires when any key related to navigation (arrows, tab, **enter**, esc, etc.) is pressed. 

修改app/login/Window.js，为用户名和密码输入框添加新的specialKey事件监听代码：
```
Ext.define('LoginDemo.login.Window', {
    // ...
    items: [
        {
            xtype: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side',
                // 新建specialKey监听
                listeners: {
                    specialKey: function(field, event, eOpts) {
                        if (event.getKey() == event.ENTER) {
                            Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
                        }
                    }
                }
            },
            items: [
                // ...
            ],
            dockedItems: [
                // ...
            ]
        }
    ]
});
```
把代码放在defaults里是因为这段代码对于用户名和密码输入框是相同的。
通过specialKey事件的第二个参数event的getKey()方法，我们可以来判断用户按下的是否是回车键，如果是，就弹出和点击Submit按钮一样的消息框。
刷新浏览器，在用户名和密码输入框里按回车，也会弹出消息框了。

##### ViewController
先不看刚才新添加代码里的一个逻辑上的bug，现在有两个地方都用到了同样的Ext.Msg.alert(...)代码，是否应该开始考虑代码重用了呢？
Ext JS也支持传统的MVC，我们可以把逻辑代码集中放到Controller([Ext.app.Controller](http://docs.sencha.com/extjs/6.2.0/classic/Ext.app.Controller.html))中。但在这里我想演示的是Ext JS提供的另一种Controller——ViewController([Ext.app.ViewContoller](http://docs.sencha.com/extjs/6.2.0/classic/Ext.app.ViewController.html))。
按我的理解ViewController和Controller的作用是一样，只是两者的生命周期和作用范围不一样。
Controller的生命周期和程序一致，即从程序启动到最后关闭为止。它的作用范围也是整个程序。
ViewController生命周期和作用范围则要小得多，和它的名字一样，会紧紧地和某个View联系在一起，我们接下来要创建的ViewController仅仅为我们的Login窗口服务。
在login目录下新建一个文件Controller.js。

![新建Controller.js](http://upload-images.jianshu.io/upload_images/2105640-48c0ecaf7a2ed0d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

编辑app/login/Controller.js，输入以下代码：
```
Ext.define('LoginDemo.login.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.login-win',

	login: function() {
		Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
	},

	onSubmitButtonClick: function(button, event) {
        this.login();
	},

	onEnterPress: function(field, event, eOpts) {
        if (event.getKey() == event.ENTER) {
            this.login();
        }
	}
});
```
Ext.define()和extend就不再解释了，我们来看第三行的alias: 'controller.login-win'。因为ViewController是和View绑定在一起，它会随着View的创建而自动一起创建，所以我们不需要显式的使用如Ext.create()等方法去实例化它。因此我们无需为它设置xtype值，但为了将它和View绑定，Ext JS要求我们为ViewController设置alias的值。alias的格式是controller.controllerName，并且controllerName必须唯一。在这里我们为Login窗口创建的ViewController取名为login-win。
我们在controller里创建了三个方法：
- login()
登录的逻辑代码，在这个Demo里，只是简单的弹出一条消息。
- onSubmitButtonClick
当点击Submit按钮时调用login()方法。
- onEnterPress
对应当回车键被按下后调用login()方法。

ViewController这边的代码已经完成，接下来需要修改View的代码来绑定ViewController。
修改app/login/Window.js，做四处改动：
```
Ext.define('LoginDemo.login.Window', {
    extend: 'Ext.window.Window',
    requires: [ // (#1)
		'LoginDemo.login.Controller'
	],
    xtype: 'login-win',
    controller: 'login-win', // (#2)
    // ...
    items: [
        {
            xtype: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side',
                listeners: {
                    specialKey: 'onEnterPress' // (#3)
                }
            },
            items: [
                // ...
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->',
						{
                            xtype: 'button',
                            iconCls: 'fa fa-sign-in fa-lg',
                            text: 'Submit',
                            formBind: true,
                            handler: 'onSubmitButtonClick' // (#4)
                        }
                    ]
                }
            ]
        }
    ]
});
```

*(#1) requires: []*
当我们需要在一个类中使用另一个自定义的类时，需要将该自定义的类名放在requires: []里，这样Ext JS会先创建requires: []里的类。

*(#2) controller: 'login-win'*
一个View的controller属性用来设置相关联的ViewController。

*(#3) specialKey: 'onEnterPress'*
我们已经将逻辑代码转移到了ViewController里，所以在View里我们已需要写上在ViewController里定义的方法名即可，注意方法名要用单引号括起来。

*(#4) handler: 'onSubmitButtonClick'*
同specialKey一样，Submit按钮的click事件也要写上ViewController里定义的方法名。

到这里，ViewController的设置和关联就完成了，附上到目前完整的app/login/Windows.js代码：
```
Ext.define('LoginDemo.login.Window', {
    extend: 'Ext.window.Window',
    requires: [
		'LoginDemo.login.Controller'
	],
    xtype: 'login-win',
    controller: 'login-win',
    autoShow: true,
    height: 200,
    width: 360,
    layout: {
        type: 'fit'
    },
    iconCls: 'fa fa-key fa-lg',
    title: 'Login',
    closeAction: 'hide',
    closable: false,
    draggable: false,
    resizable: false,
    items: [
        {
            xtype: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side',
                listeners: {
                    specialKey: 'onEnterPress'
                }
            },
            items: [
                {
                    name: 'userName',
                    fieldLabel: 'User Name',
                    minLength: 3,
                    maxLength: 25,
                    vtype: 'alphanum'
                },
                {
                    inputType: 'password',
                    name: 'password',
                    fieldLabel: 'Password',
                    minLength: 6,
                    maxLength: 20
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        '->',
						{
                            xtype: 'button',
                            iconCls: 'fa fa-sign-in fa-lg',
                            text: 'Submit',
                            formBind: true,
                            handler: 'onSubmitButtonClick'
                        }
                    ]
                }
            ]
        }
    ]
});
```

##### 修补onEnterPress()的逻辑漏洞
Submit按钮由于有formBind属性，所以我们可以确保只有当用户名和密码输入有效内容后才能点击Submit按钮提交。但对于回车键监听，却绕开了这个限制，形成了一个bug。
查看[Ext.form.Panel文档](http://docs.sencha.com/extjs/6.2.0/classic/Ext.form.Panel.html)，我们找到了我们需要的方法isValid()：
> **isValid: Boolean**
Convenience function to check if the form has all valid fields. This is the same as calling this.getForm().isValid(). Returns true if client-side validation on the form is successful. Any invalid fields will be marked as invalid. If you only want to determine overall form validity without marking anything, use hasInvalidField instead.
RETURNS: Boolean

通过isValid()的结果可以判断当前表单输入是否存在验证错误。
而如何在ViewController里调用Ext.form.Panel的方法，ViewController提供了lookup(reference)的方法。

先编辑app/login/Window.js，在xtype: 'form'之后加上reference: 'form'：
```
Ext.define('LoginDemo.login.Window', {
    // ...
    items: [
        {
            xtype: 'form',
            reference: 'form', // 新增reference属性
            // ...
        }
    ]
});
```
再编辑app/login/Controller.js，修改login()方法：
```
login: function() {
    if (this.lookup('form').isValid()) {
        Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
    }
}
```
使用lookup('form')获取Ext.form.Panel实例，然后执行它的isValid()方法，当返回值为true时才弹出消息框。

附上目前完整的app/login/Controller.js代码：
```
Ext.define('LoginDemo.login.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.login-win',

	login: function() {
		if (this.lookup('form').isValid()) {
			Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
		}
	},

	onSubmitButtonClick: function(button, event) {
        this.login();
	},

	onEnterPress: function(field, event, eOpts) {
        if (event.getKey() == event.ENTER) {
            this.login();
        }
	}
});
```

##### 添加语言切换按钮
我们将在Login窗口的底部再增加一个语言切换的按钮，这是一个可下拉选择的按钮，供用户选择中文或英文。
先编辑css/style.css，添加国旗图标：
```
.en_US {
	background-image: url('../resources/images/en_US.png') !important;
}

.zh_CN {
	background-image: url('../resources/images/zh_CN.png') !important;
}
```
在app目录下新建一个子目录locale，在里面创建两个文件：Button.js和Controller.js。

![locale目录](http://upload-images.jianshu.io/upload_images/2105640-ba65fa6c6eaaea81.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

app/locale/Button.js：
```
Ext.define('LoginDemo.locale.Button', {
	extend: 'Ext.button.Split', // (#1)
	xtype: 'locale-btn',
	requires: [
		'LoginDemo.locale.Controller'
	],
	controller: 'locale-btn',
	menu: { // (#2)
		xtype: 'menu',
		defaults: {
			xtype: 'menuitem', // (#3)
            handler: 'onMenuItemClick' // (#4)
		},
		items: [
			{
				iconCls: 'en_US', // (#5)
				text: 'English'
			},
			{
				iconCls: 'zh_CN',
				text: '中文'
			}
		]
	}
});
```
app/locale/Controller.js：
```
Ext.define('LoginDemo.locale.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.locale-btn',

	onMenuItemClick: function(item, event) { // (#5)
		
	}
});
```

LoginDemo.locale.Button是我们自定义的View类，而LoginDemo.locale.Controller是Button对应的ViewController。
要创建有下拉箭头的按钮的UI，我们可以继承(#1) [Ext.button.Split](http://docs.sencha.com/extjs/6.2.0/classic/Ext.button.Split.html)。Split Button作为容器必须要有一个子元素(#2) menu，这是和其它容器类不同的一点（其它容器类的子元素可以有多个，用的是items）。
menu的子元素是(#3) menuitem，我们创建两个，分别是English和中文，通过设置iconCls来显示国旗图标。menuitem的click事件和button一样可以简写成handler，我们在ViewController里创建(#4) onMenuItemClick方法来处理当用户切换语言时的逻辑。

语言切换按钮的样子已经搭好，接着就是把它加到Login窗口里。
修改app/login/Window.js，修改两处：
```
Ext.define('LoginDemo.login.Window', {
    extend: 'Ext.window.Window',
    requires: [
		'LoginDemo.login.Controller',
        'LoginDemo.locale.Button' // (#1)
	],
    // ...
    items: [
        {
            xtype: 'form',
            // ...
            items: [
                // ...
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'locale-btn' // (#2)
                        },
                        '->',
			            // ...
                    ]
                }
            ]
        }
    ]
});
```
首先需要把自定义的Button类加到Window的requires里(#1)。然后实例化Button并把它加为toolbar的第一个子元素(#2)。

刷新浏览器，查看效果：

![语言切换按钮](http://upload-images.jianshu.io/upload_images/2105640-db4c6cff92a644ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 创建翻译文本
在resources目录下新建子目录locale，然后在locale目录里创建两个文件：en_US.js和zh_CN.js。

![翻译文本文件](http://upload-images.jianshu.io/upload_images/2105640-a13d11c8c2cfe8a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们会把以下文本改为可切换的翻译文本：
- Loading画面上显示的文字：'Loading...'
- Login窗口标题栏的文字：'Login'
- 用户名的标签：'User Name'
- 密码的标签：'Password'
- 提交按钮上的文字：'Submit'

resources/locale/en_US.js：
```
locale = {
	loadingScreen: 'Loading...',
	login: 'Login',
	userName: 'User Name',
	password: 'Password',
	submit: 'Submit'
};
```
resources/locale/zh_CN.js：
```
locale = {
	loadingScreen: '启动中...',
	login: '登录',
	userName: '用户名',
	password: '密码',
	submit: '提交'
};
```

##### 加载翻译文本文件
翻译文本文件应在所有其它代码执行之前就被加载。
修改app/Application.js，在开头处插入代码：
```
function loadLocale() { // (#1)
	var lang = localStorage ? (localStorage.getItem('user-lang') || 'en_US') : 'en_US', // (#2)
		file = Ext.util.Format.format('resources/locale/{0}.js', lang); // (#3)
	Ext.Loader.loadScript({ //(#4)
		url: file,
		onError: function() {
			alert('Error loading locale file.');
		}
	});
	var extJsFile = Ext.util.Format.format('ext/locale/locale-{0}.js', lang); // (#5)
	Ext.Loader.loadScript({
		url: extJsFile
	});
}

loadLocale(); //(#6)

Ext.define('LoginDemo.Application', {
    // ...
});

Ext.application('LoginDemo.Application');
```
首先我们创建了一个自定义的方法(#1) loadLocale()用来读取翻译文本文件。我们将使用HTML5的Local Storage来保存用户的语言选择(#2)，如果从未选择过，则默认语言为英文。接着根据Local Storage的读取结果来选择读取哪一个翻译文本文件(#3)。最后用Ext.Loader的loadScript方法完成翻译文件的读取(#4)。
除了我们自定义的翻译文本，我们还将同时读取Ext JS的语言文本(#5)，这将影响到Ext JS自带的文本显示，比如输入框验证报错信息等。
方法定义好了，记得要运行(#6)。

##### 替换翻译文本
替换app/Application.js中的init()方法中的'Loading...'为：
```
me.loadingScreen = Ext.getBody().mask(locale.loadingScreen, 'x-loadingscreen');
```
替换app/login/Window.js的title属性'Login'为：
```
title: locale.login
```
替换app/login/Window.js中用户名输入框的fieldLabel属性'User Name'为：
```
fieldLabel: locale.userName
```
替换app/login/Window.js中密码输入框的fieldLabel属性'Password'为：
```
fieldLabel: locale.password
```
替换app/login/Window.js中Submit按钮的text属性'Submit'为：
```
text: locale.submit
```

##### onMenuItemClick
编辑app/locale/Controller.js，为onMenuItemClick方法添加如下代码：
```
onMenuItemClick: function(item, event) {
    var button = this.getView(); // (#1)
    button.setIconCls(item.iconCls); // (#2)
    button.setText(item.text);
    localStorage.setItem('user-lang', item.iconCls); // (#3)
    window.location.reload(); // (#4)
}
```
ViewController的getView()方法可以用来获取所绑定的View的实例，在这里我们获取到Button的实例(#1)，然后使用Button的setIconCls()和setText()来把menuitem的图标和文本显示在Button上(#2)，把所选语言保存到Local Storage(#3)，最后刷新页面(#4)。

刷新浏览器，切换到中文：

![中文显示](http://upload-images.jianshu.io/upload_images/2105640-e6978e677adb4866.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

查看开发者工具，确认语言设置已经保存到了Local Storage：

![Local Storage](http://upload-images.jianshu.io/upload_images/2105640-a2548af0a9ee6a7e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 修复Button显示问题
现在还有一个问题有待修复：语言切换按钮上没有显示图标和文本。
编辑app/locale/Controller.js，在onMenuItemClick()前新增一个init()方法：
```
init: function() {
    var lang = localStorage ? (localStorage.getItem('user-lang') || 'en_US') : 'en_US',
	    button = this.getView();
    button.setIconCls(lang);
    if(lang == 'en_US') {
	    menu.setText('English');
    } else if (lang == 'zh_CN') {
	    menu.setText('中文');
    }
},
```
在app/Application.js中也出现过init()方法，它的作用是在类完成加载前执行，我们现在就是要在Button完成加载前根据当前的语言设置把相应的图标和文字设置好。

刷新浏览器，可以看到最终的效果：

![最终效果](http://upload-images.jianshu.io/upload_images/2105640-829e780b45e6939a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

至此，我们已经完成了Login窗口的创建。
附上目前完整的app/locale/Controller.js的代码：
```
Ext.define('LoginDemo.locale.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.locale-btn',

    init: function() {
		var lang = localStorage ? (localStorage.getItem('user-lang') || 'en_US') : 'en_US',
			button = this.getView();
		button.setIconCls(lang);
		if(lang == 'en_US') {
			button.setText('English');
		} else if (lang == 'zh_CN') {
			button.setText('中文');
		}
	},

	onMenuItemClick: function(item, event) {
        var button = this.getView();
		button.setIconCls(item.iconCls);
		button.setText(item.text);
		localStorage.setItem('user-lang', item.iconCls);
		window.location.reload();
	}
});
```

接着再来看两个锦上添花的小功能。

##### 大写键打开警告
比如Windows登录，如果你的大写键打开了，在密码输入框附近会显示一个警告，提醒你关闭大写键。

![Windows大写键打开警告](http://upload-images.jianshu.io/upload_images/2105640-f21beb3fafda81d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们现在就来实现这一功能。

为警告信息添加翻译文本。
修改resources/locale/en_US.js：
```
locale = {
	loadingScreen: 'Loading...',
	login: 'Login',
	userName: 'User Name',
	password: 'Password',
	submit: 'Submit',
    // 新增翻译文本
	capslocktooltip: 'Caps Lock in On'
};
```
修改resources/locale/zh_CN.js：
```
locale = {
	loadingScreen: '启动中...',
	login: '登录',
	userName: '用户名',
	password: '密码',
	submit: '提交',
    // 新增翻译文本
	capslocktooltip: '大写锁定被打开'
};
```
修改app/login/Window.js，设置监听：
```
Ext.define('LoginDemo.login.Window', {
    // ...
    items: [
        {
            xtype: 'form',
            reference: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side'
               // 删除defaults的listeners
            },
            items: [
                {
                    name: 'userName',
                    fieldLabel: locale.userName,
                    minLength: 3,
                    maxLength: 25,
                    vtype: 'alphanum',
                    // 为用户名输入框添加listeners
                    listeners: {
						specialKey: 'onUserNameEnterPress' // (#1)
					}
                },
                {
                    inputType: 'password',
                    name: 'password',
                    fieldLabel: locale.password,
                    minLength: 6,
                    maxLength: 20,
                    // 打开键盘输入监听，并为密码输入框添加listeners
                    enableKeyEvents: true, // (#2)
					listeners: {
						specialKey: 'onPasswordEnterOrCapsLockPress', // (#3)
						keypress: 'onPasswordKeyPress' // (#4)
					}
                }
            ],
            dockedItems: [
                // ...
            ]
        }
    ]
});
```
在之前的代码中，用户名和密码输入框共用同一个specialKey监听事件，现在需要分开，所以先删除defaults里定义的listeners。
为用户名输入框添加specialKey监听(#1)，方法名叫onUserNameEnterPress，稍后我们会在ViewController里实现该方法。

接着来分析一下密码输入需要监听的事件：
- 我们仍然需要监听用户是否按了回车键。
- 我们需要监听用户是否按了大写键，如果用户按了大写键，就会显示警告，当用户再按一下大写键，则隐藏警告。
- 如果在输入密码前，用户的大写键已经处于打开状态，这时我们就需要通过用户输入的字母是否为大写字母来判断并决定是否显示警告。

前2种情况，我们都可以使用specialKey来监听，回车和大写键都属于specialKey，我们可以为密码输入框添加specialKey监听(#3)，监听的方法名叫onPasswordEnterOrCapsLockPress。
而对于第三种情况，我们则需要监听用户的字母输入，Ext JS也提供对应的监听事件keypress，但出于性能上的考虑，默认情况下这一监听是关闭的，我们需要通过设置enableKeyEvents属性(#2)，来手动将监听打开。我们监听keypress的方法名叫onPasswordKeyPress(#4)。

修改app/login/Controller.js，删除onEnterPress()方法并新建四个方法，以下是完整代码：
```
Ext.define('LoginDemo.login.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.login-win',

	login: function() {
		if (this.lookup('form').isValid()) {
			Ext.Msg.alert('Login Demo', '<span class="fa fa-smile-o"></span> Thank you for reading my post!');
		}
	},

	onSubmitButtonClick: function(button, event) {
        this.login();
	},

	onUserNameEnterPress: function(field, event, eOpts) {
		if (event.getKey() === event.ENTER) {
			this.login();
		}
	},

	onPasswordEnterOrCapsLockPress: function(field, event, eOpts) {
		var me = this;
		if (event.getKey() === event.ENTER) {
			me.login();
		} else if (event.getKey() === event.CAPS_LOCK) { // (#1)
			me.createCapsLockTip(); // (#2)
			if (!me.capslocktooltip.isVisible()) { // (#3)
				me.capslocktooltip.showBy(field, 'bl', [70, 5]); // (#4)
			} else {
				me.capslocktooltip.hide(); // (#5)
			}
		}
	},

	onPasswordKeyPress: function(field, event, eOpts) {
		var charCode = event.getCharCode(), // (#6)
			me = this;
		if ((event.shiftKey && charCode >= 97 && charCode <= 122) ||
			(!event.shiftKey && charCode >= 65 && charCode <= 90)) { // (#7)
			me.createCapsLockTip();
			if (!me.capslocktooltip.isVisible()) {
				me.capslocktooltip.showBy(field, 'bl', [70, 5]);
			}
		} else {
			if (me.capslocktooltip !== undefined && me.capslocktooltip.isVisible()) {
				me.capslocktooltip.hide();
			}
		}
	},

	createCapsLockTip: function() {
		var me = this;
		if (me.capslocktooltip === undefined) { // (#8)
			me.capslocktooltip = Ext.create('Ext.tip.Tip', { // (#9)
				alwaysOnTop: true,
				width: 130,
				html: '<div class="fa fa-exclamation-triangle"> ' + locale.capslocktooltip + '</div>'
			});
		}
	}
});
```
我们去掉了原先用户名和密码输入框共用的方法onEnterPress()。
新建的onUserNameEnterPress()用于监听用户名输入框的回车，并直接调用login()方法。
接着来看最后一个方法createCapsLockTip()，在这个方法里我们使用Ext.tip.Tip类来创建警告信息的UI，并保存在成员变量capslocktooltip(#9)。每次调用这个方法时，都会先判断是否已经创建过，避免重复创建(#8)。
onPasswordEnterOrCapsLockPress()用来监听密码输入框的回车和大写键。如果用户按了回车，则直接调用login()。如果用户按了大写键(#1)，则调用createCapsLockTip()方法(#2)，接着使用isVisible()方法(#3)判断目前大写警告是否显示，如果没有显示则用showBy()方法(#4)来显示，否则就用hide()方法(#5)隐藏。showBy的三个参数表示按密码输入框的底部左对齐(bl), 并向右偏70，向下偏5。
onPasswordKeyPress()用来监听密码输入框的字母输入，使用event.getCharCode()方法(#6)可以获取键盘输入的字母所对应的charCode，接着通过以下2个条件判断大写键处于打开状态(#7)：
1. 当按着shift键时输入的字母的charCode在97到122之间。
2. 当没有按着shift键时输入的字母的charCode在65到90之间。

然后根据判断结果显示或隐藏大写键警告。

刷新浏览器，查看效果：

![大写键警告](http://upload-images.jianshu.io/upload_images/2105640-4b3739bff5bb1a6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 密码输入的复杂校验
之前的代码对应的密码输入的校验要求是不能为空，并且长度在6到20之间。但很多时候我们会要求更高的密码复杂度要求。现在我们就来实现**密码的长度必须6到20位之间，且必须至少包含1个数字、1个小写字母、1个大写字母和1个特殊字符@#$%**。

为校验错误信息添加翻译文本。
修改resources/locale/en_US.js：
```
locale = {
	loadingScreen: 'Loading...',
	login: 'Login',
	userName: 'User Name',
	password: 'Password',
	submit: 'Submit',
	capslocktooltip: 'Caps Lock in On',
    // 新增翻译文本
	customPassText: 'Not a valid password. Length must be at least 6 characters and maximum of 20. Password must contain one digit, one letter lowercase, one letter uppercase, one special symbol @#$%.'
};

```
修改resources/locale/zh_CN.js：
```
locale = {
	loadingScreen: '启动中...',
	login: '登录',
	userName: '用户名',
	password: '密码',
	submit: '提交',
	capslocktooltip: '大写锁定被打开',
    // 新增翻译文本
	customPassText: '无效的密码格式。密码的长度必须6到20位之间，且必须至少包含1个数字、1个小写字母、1个大写字母和1个特殊字符@#$%。'
};
```
修改app/login/Window.js，在最后新增以下代码：
```
Ext.apply(Ext.form.field.VTypes, {
    customPass: function(val, field) {
        return /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/.test(val);
    },
    customPassText: locale.customPassText
});
```
在用户名输入上我们加上了Ext JS提供的vtype: 'alphanum'。而Ext JS允许我们自定义vtype，需要提供2个属性设置，第一个是一段正则表达式，第二段是校验出错时显示的文本。

然后修改app/login/Window.js，去掉原来长度的限制，加上新定义的vtype：
```
{
    inputType: 'password',
    name: 'password',
    fieldLabel: locale.password,
    vtype: 'customPass', // 自定义的vtype
    enableKeyEvents: true,
    listeners: {
	    specialKey: 'onPasswordEnterOrCapsLockPress',
	    keypress: 'onPasswordKeyPress'
	}
}
```

附上完整的app/login/Window.js代码：
```
Ext.define('LoginDemo.login.Window', {
    extend: 'Ext.window.Window',
    requires: [
		'LoginDemo.login.Controller',
        'LoginDemo.locale.Button'
	],
    xtype: 'login-win',
    controller: 'login-win',
    autoShow: true,
    height: 200,
    width: 360,
    layout: {
        type: 'fit'
    },
    iconCls: 'fa fa-key fa-lg',
    title: locale.login,
    closeAction: 'hide',
    closable: false,
    draggable: false,
    resizable: false,
    items: [
        {
            xtype: 'form',
            reference: 'form',
            bodyPadding: 15,
            defaults: {
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 70,
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [
                {
                    name: 'userName',
                    fieldLabel: locale.userName,
                    minLength: 3,
                    maxLength: 25,
                    vtype: 'alphanum',
                    listeners: {
						specialKey: 'onUserNameEnterPress'
					}
                },
                {
                    inputType: 'password',
                    name: 'password',
                    fieldLabel: locale.password,
                    vtype: 'customPass',
                    enableKeyEvents: true,
					listeners: {
						specialKey: 'onPasswordEnterOrCapsLockPress',
						keypress: 'onPasswordKeyPress'
					}
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'locale-btn'
                        },
                        '->',
						{
                            xtype: 'button',
                            iconCls: 'fa fa-sign-in fa-lg',
                            text: locale.submit,
                            formBind: true,
                            handler: 'onSubmitButtonClick'
                        }
                    ]
                }
            ]
        }
    ]
});

Ext.apply(Ext.form.field.VTypes, {
    customPass: function(val, field) {
        return /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/.test(val);
    },
    customPassText: locale.customPassText
});
```

可以从git上clone完整的代码：
```
git clone https://github.com/xyyy1719/ExtJSLoginDemo.git
```
