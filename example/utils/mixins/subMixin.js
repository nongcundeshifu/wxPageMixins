export default {

	// 生命周期钩子函数
	onLoad(options) {
		console.log('[subMixin log]: this is subMixin.js');
		console.log('[subMixin log]: 我即使被重复引用了，也仅执行一次');
	},
	data() {
		return {
			title: 'this is subMixin.js',
			// 对象数据
			arr: [1, 2, 3],
		}
	},

	subMixin() {
		console.log('[subMixin log]: this is subMixin function');
	},

	tap(e) {
		console.log('[subMixin log]: this is tap function', e);
	},

}