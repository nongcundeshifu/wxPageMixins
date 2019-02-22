

// 定义扩展的字段名称
const MIXIN = 'mixins';

const warn = (meg) => {
    console.error(meg);
}

const isUndef = function (val) {
    return val === undefined;
}


const _toString = Object.prototype.toString;
const isObject = (obj) => {
    return _toString.call(obj) === '[object Object]';
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = function (obj, key) {
    return _hasOwnProperty.call(obj, key);
}

const isFunction = (fn) => {
    return typeof fn === 'function';
}


// 自定义合并策略对象。
const strats = Object.create(null);

const defaultStatus = function (parentVal, childVal) {
    return isUndef(childVal) ? parentVal : childVal;
}


// 1.合并钩子函数时，最好是全部直接合并成为一个数组，当所有的mixin以及参数合并完后
// 最后再由wxPageMixins函数进行包装成一个函数。
// 2.解决多次引用时，导致的同一个生命周期函数多次调用问题：如果发现重复引用，可以
// 选择是不做处理，还是将原来的那个生命周期函数删掉，再添加这一个（执行顺序的问题）
const mergeHooks = function (parentVal, childVal) {

    if (!childVal) {
        return parentVal;
    }

    const parentIsArray = Array.isArray(parentVal);

    if (parentVal && !parentIsArray) {
        parentVal = [parentVal];
    }

    // 判断此函数是否已经存在此列表中了
    if (parentIsArray) {
        const index = parentVal.findIndex((value) => {
            return value === childVal;
        });
        if (index >= 0) {
            // 直接不做处理返回
            // return parentVal;
            // 或者删除掉原来的，再重新添
            parentVal.splice(index, 1);
            return parentVal.concat(childVal);
        }


    }



    return parentVal ? parentVal.concat(childVal)
        : Array.isArray(childVal) ? childVal : [childVal];


}

// 合并data数据函数
const mergeData = function (to, from) {

    if (!from) {
        return to;
    }

    if(!isObject(to) || !isObject(to)) {
        warn('data为一个数据对象或者data函数返回的为一个数据对象');
    }


    let key, toVal, fromVal;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        }
        else if(toVal !== fromVal && isObject(toVal) && isObject(fromVal)){
            // 如果都是对象的话，进行递归合并
            to[key] = mergeData(toVal, fromVal);
        }
    }

    return to;


}

// data处理函数
const mergeDataOrFn = (parentVal, childVal) => {


    if (!childVal) {
        return parentVal;
    }
    if (!parentVal) {
        return childVal;
    }


    return function () {

        const parentData = isFunction(parentVal)
            ? parentVal.call(this, this) : parentVal;
        const childData = isFunction(childVal)
            ? childVal.call(this, this) : childVal;

        return mergeData(childData, parentData);
    };


}

// data合并策略
strats.data = (parentVal, childVal) => {

    // 这里没有判断data必须为一个函数(小程序中没有必要)。如果要判断的话，可以考虑给
    // 实例参数增加一个标识符。没有标识符的则需要为函数

    return mergeDataOrFn(parentVal, childVal);


}


// Page组件的生命周期函数的合并。
const pageLifecycleHooks = [
    'onLoad',
    'onReady',
    'onShow',
    'onHide',
    'onUnload',
];

// 可能需要直接覆盖的，而不是合并函数的内部事件，这个直接使用默认合并，即覆盖策略。
// 此处只是罗列出来
const pageInternalEvent = [
    'onShareAppMessage',
    'onPullDownRefresh',
    'onReachBottom',
    'onPageScroll',
    'onResize',
    'onTabItemTap',
];

pageLifecycleHooks.forEach((key) => {
    strats[key] = mergeHooks;
})

const mergeOptions = (parent, child) => {

    if (!isObject(child)) {
        warn('wxPageMixins的参数必须是一个对象!');
        return parent;
    }

    const mixin = child[MIXIN];


    // 更好实现：如果有mixin，则直接合并到parent中，反正parent是最低的优先级。
    if (mixin && isObject(mixin)) {

        // 不能再以child作为子数据执行mergeOptions方法，否则会进入死循环的。
        parent = mergeOptions(parent, mixin);

    }
    else if (mixin && Array.isArray(mixin) && mixin.length > 0) {
        mixin.forEach((mixinObj) => {
            parent = mergeOptions(parent, mixinObj);

        })

    }




    let key;
    const options = {};
    for (key in parent) {
        options[key] = mergeField(parent, child, key);
    }

    for (key in child) {
        if (!hasOwn(key)) {
            options[key] = mergeField(parent, child, key);
        }
    }


    function mergeField(parentOptions, childOptions, optionsKey) {
        const mergeSstrats = strats[optionsKey] || defaultStatus;
        return mergeSstrats(parentOptions[optionsKey], childOptions[optionsKey]);
    }


    return options;



}

// 规范统一合并后的Data，使其可以符合Page构造函数的规范。
const normalizeData = (options) => {

    if(!options.data) {
        return;
    }

    options.data = isFunction(options.data) ? options.data() : options.data;

}

// 将合并后的生命周期钩子字段转换为一个函数。
const normalizeHookToFn = function (hook) {

    if (!Array.isArray(hook)) {
        return hook;
    }

    return function (...ags) {
        hook.forEach((hookFn) => {
            hookFn.apply(this, ags);
        })
    }

}


// 规范统一合并后的生命周期钩子函数，使其可以符合Page构造函数的规范，因为他必须是一个函数
const normalizeHooks = (options) => {


    pageLifecycleHooks.forEach((hook) => {

        if (options[hook]) {
            options[hook] = normalizeHookToFn(options[hook]);
        }

    })

}


const wxPageMixins = (options) => {


    // 是在合并mergeOptions函数中判断是否有混入的
    const resultOptions = mergeOptions({}, options);

    normalizeData(resultOptions);
    normalizeHooks(resultOptions);

    return resultOptions;


}


export default wxPageMixins;




