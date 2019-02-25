# wxPageMixins
一个支持Mixins混入的用来合并微信小程序的Page参数的工具
> 用于page页面的混入函数，以提取出公共的代码部分，比如公共的逻辑代码。小程序组件请使用其自带的behaviors进行混入，这里所写只针对Page页面构造时的混入。

### 开发由来
因为最开始学习vue源码的参数合并后，想找一个东西学习练手，而我目前本是做微信小程序开发的，而我发现微信小程序中只有组件拥有behaviors参数合并，而Page页面没有类似的功能，所以便想根据在vue源码中学到的选项参数合并知识，开发一个类似mixin合并功能的用于微信小程序Page页面的函数。

### 使用
*注意：代码本身使用es6语法，在小程序中只需要开启es6转es5功能即可*  
他目前仅暴露了一个wxPageMixins函数，用于选项的合并，而其代码本身只是拿vue中的选项合并代码进行改的。基本使用如下：
```javascript
// 引入wxPageMixins
import wxPageMixins from './wxPageMixins.js';
import mixin from 'mixin.js';
// 在微信小程序中
Page(wxPageMixins({
	mixins: [mixin],
	// other props
}));
```
wxPageMixins方法接受一个参数，这个参数和微信小程序中的Page构造函数规范一致，除此之外，他还可以接受一个mixins字段的参数，mixins定义需要合并的Page参数对象的数组。也可以直接是一个Page参数对象。wxPageMixins方法会遍历mixins字段（如果有值的话），把mixins字段中的参数选项和你直接传入的对象属性进行合并，然后返回合并后的对象。

### 参数字段
每个 mixins 可以包含一组数据、生命周期函数和方法，和微信小程序Page构造函数所接收的参数一致，wxPageMixins方法会把对象的mixins字段的属性、数据和方法以及你传入wxPageMixins方法的参数一起合并到一个对象中，并返回一个可用的Page构造函数的参数，生命周期函数会在对应时机被调用。每个mixins可以引用多个mixin对象 。 mixin对象中 也可以引用其他 mixin 。他们会按照数组的顺序进行依次合并。
+ mixin混入对象其实就是一个和微信小程序Page构造函数的参数具有相同规范的对象。

### 参数字段合并规则
+ data: 为一个函数或者一个数据对象，如果是一个函数则返回一个对象数据，数据对象合并时会进行递归合并，如果是原始值则后者覆盖前者，如果相同字段且都是一个对象时（不是数组，数组会直接覆盖，并不会合并），则进行递归合并。
    > ps: 他和vue不同，这里的data可以不是一个函数，所以并且没有做此校验，因为好像微信小程序中的Page内部有做处理，会把data转换为JSON，而且微信小程序组件的data也没有做函数要求。所以data可以不是函数。你写函数也完全ok

+ 生命周期函数：生命周期函数不会相互覆盖，而是在对应触发时机被逐个调用。如果同一个 mixin 被一个组件多次引用（重复引用，嵌套引用），它定义的生命周期函数只会被执行一次。会合并的生命周期钩子函数如下：
	+ onLoad
	+ onReady
	+ onShow
	+ onHide
	+ onUnload
+ 其他微信小程序自定义的事件处理函数会进行事件处理覆盖，如下：
	+ onShareAppMessage
	+ onPullDownRefresh
	+ onReachBottom
	+ onPageScroll
	+ onResize
	+ onTabItemTap
+ 其他自定义字段：直接后者覆盖前者(如果是对象也不会进行递归遍历而是直接覆盖)

+ 如果有多个mixin对象，或者有嵌套引用mixin时，则mixins字段将进行深度优先的递归合并。并且越靠后，则优先级越高。

### 注意
+ 不要进行循环引用，估计会炸。
+ 在混入对象（mixin）中，无法获取到Page构造函数执行的那一个作用域，mixin中的处理函数中只能拿到page对象，也就是this。但无法拿到调用Page构造函数之外的变量数据。
+ 小程序官网对data对象的介绍：`页面加载时，data 将会以JSON字符串的形式由逻辑层传至渲染层，因此data中的数据必须是可以转成JSON的类型：字符串，数字，布尔值，对象，数组。`
### 其他
> 目前此mixin合并函数只针对于小程序所编写，并且，其语法使用es6的一些语法，所以最好只使用在小程序中。后面可能会编写一个通用的工具吧。

### license

[MIT](http://opensource.org/licenses/MIT)
