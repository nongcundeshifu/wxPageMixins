import subMixins from './subMixin.js';

export default {

	mixins: [subMixins],

	// 生命周期钩子函数
	onLoad(options) {
		console.log('[testMixin log]: this is testMixin.js');
		console.log('[testMixin log]: this page options is: ', options);
		// 执行子mixins对象的方法。
		this.subMixin();
	},
	data() {
		return {
			title: 'this is testMixin.js',
			// 对象数据
			message: {
				name: 'testMixin',
				age: 22,
			}
		}
	},

	// 其他小程序自定义函数
	onShareAppMessage() {
		return {
			title: this.data.title,
		}
	},

	click(e) {
		console.log('[testMixin log]: this is click function', e);
	},

}