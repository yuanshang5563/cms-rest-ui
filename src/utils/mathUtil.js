/**
 * 加 add
 * @param {*} arg1 
 * @param {*} arg2 
 * @param {*} num num为保留位数,不传时不四舍五入
 * @returns 
 */
export function add(arg1,arg2,num){
    arg1=Number(arg1);
    arg2=Number(arg2);
    let r1=0,r2=0,m;
    try {r1 = arg1.toString().split('.')[1].length;} catch (e) {}
    try {r2 = arg2.toString().split(".")[1].length;} catch (e) {}
    m = Math.pow(10, Math.max(r1, r2));
    if(num||num===0){
        //注意：fixed四舍五入大于5会进1 5并不会进1
        return ((arg1 * m + arg2 * m) / m).toFixed(num); 
    }
    return (arg1 * m + arg2 * m) / m;
}

/**
 * 减 reduce
 * @param {*} arg1 
 * @param {*} arg2 
 * @param {*} num num为保留位数,不传时不四舍五入
 * @returns 
 */
 export function reduce(arg1,arg2,num){
    arg1=Number(arg1);
    arg2=Number(arg2);
    let r1=0,r2=0,m;
    try {r1 = arg1.toString().split('.')[1].length;} catch (e) {}
    try {r2 = arg2.toString().split(".")[1].length;} catch (e) {}
    m = Math.pow(10, Math.max(r1, r2));
    if(num||num===0){
        //注意：fixed四舍五入大于5会进1 5并不会进1
        return ((arg1 * m - arg2 * m) / m).toFixed(num); 
    }
    return (arg1 * m - arg2 * m) / m;
}

/**
 * 乘 multiply
 * @param {*} arg1 
 * @param {*} arg2 
 * @param {*} num num为保留位数,不传时不四舍五入  
 * @returns 
 */
 export function mul(arg1, arg2,num){ 
    //获取两个相乘数据的小数点后面的数据的长度，即获取小数的位数，因为最终相乘计算的结果：结果小数的位数=第一个数的小数位数+第二个数的小数位数
	let m=0,s1=arg1.toString(),s2=arg2.toString();
	try{m+=s1.split(".")[1].length;}catch(e){}
    //将两个小数去掉小数点，强制转换整个值（即进行数值放开小数点位数的倍数），然后进行相乘的操作，相乘的结果除去10的m次方
	try{m+=s2.split(".")[1].length;}catch(e){}
	if(num||num===0){
        //注意：fixed四舍五入大于5会进1 5并不会进1
 		return (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(num); 
 	}
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

/**
 * 除 division
 * @param {*} arg1 
 * @param {*} arg2 
 * @param {*} num num为保留位数,不传时不四舍五入
 * @returns 
 */
 export function accDiv(arg1,arg2,num){
	let t1=0,t2=0,r1,r2;
	if(arg2==0){
    	return Number(arg2).toFixed(num);
    }
	try{t1=arg1.toString().split(".")[1].length}catch(e){}
	try{t2=arg2.toString().split(".")[1].length}catch(e){}
	r1=Number(arg1.toString().replace(".",""));
	r2=Number(arg2.toString().replace(".",""));
	if(num||num===0){
		return ((r1/r2)*Math.pow(10,t2-t1)).toFixed(num);
	}
	return (r1/r2)*Math.pow(10,t2-t1);
}
