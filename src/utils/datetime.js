/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat = year + dateSeprator + month + dateSeprator + day + " " + hh + timeSeprator + mm + timeSeprator + ss;
    return timeFormat;
  }
}


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function formatDate (datetime) {
  return formatDateWithSeperator(datetime, "-");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatDateWithSeperator (datetime, dateSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const timeFormat = year + dateSeprator + month + dateSeprator + day ;
    return timeFormat;
  }
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 11:54:16
 * 可以指定日期和时间分隔符
 * @param time 国际化日期格式
 */
 export function formatTime (time) {
  return formatTimeWithSeperator(time, ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 11:54:16
 * 可以指定日期和时间分隔符
 * @param time 国际化日期格式
 */
 export function formatTimeWithSeperator (time, dateSeprator) {
  if (time != null) {
    const dateMat = new Date(time);
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat = hh + dateSeprator + mm + dateSeprator + ss ;
    return timeFormat;
  }
}