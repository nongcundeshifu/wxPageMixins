// pages/test/test.js
// 导入wxPageMixins，注意使用相对路径
import wxPageMixins from '../../utils/wxPageMixins/wxPageMixins.js';
// 导入mixins对象
import testMixin from '../../utils/mixins/testMixin.js';
import test2Mixin from '../../utils/mixins/test2Mixin.js';
import subMixin from '../../utils/mixins/subMixin.js';

// 使用wxPageMixins合并参数
Page(wxPageMixins({

	// 引用mixin，顺序的不同，合并后的结果也可能不用，因为越在数组后面，其数据合并的优先级越高
	mixins: [testMixin, test2Mixin],

	// subMixin被重复引用，因为testMixin也引入了subMixin，重复引用的生命周期钩子函数也只执行一次。
	// 你可以使用此mixins选项，看和上面的有何不同。
	// mixins: [testMixin, test2Mixin, subMixin],

	

	/**
	 * 页面的初始数据
	 */
	data: {
		imageSrc: 'https://temp.mixins.com',
		arr: [4, 5, 6],
		message: {
			age: 1,
			info: {
				vname: 'vname',
				vage: 100,
			},
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('[test log]: this is test.js');
		console.log('[test log]: this page options is: ', options);
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	tap(e) {
		console.log('[test log]: this is tap function', e);
	},

}))