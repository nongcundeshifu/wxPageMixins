export default {

	// 生命周期钩子函数
	onShow() {
		console.log('[test2Mixin log]: this is test2Mixin onShow log');
	},
	data() {
		return {
			imageSrc: 'https://temp.mixins.com',
			icon: {
				iconClass: 'icon-active',
				iconImageSrc: 'https://temp.icon.com',
			},
		}
	},

	
	

}