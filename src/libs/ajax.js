import $ from 'flyio';
import auth from '@/libs/relic';

const host = 'http://www.yui.org.cn/';

$.config.timeout = 10000;
$.config.baseURL = host;

function onprogress(evt){
  var loaded = evt.loaded;     //已经上传大小情况
  var tot = evt.total;      //附件总大小
  var per = Math.floor(100 * loaded / tot);  //已经上传的百分比
  console.log(per);
}

$.engine = () => {
  var xhr = new XMLHttpRequest();
  xhr.upload.addEventListener("progress", onprogress, false);
  return xhr;
};

function error(err) {
  if(err.status === 401) {
    window.location.href = '/login';
  }
  console.error(err);
  return false;
}
/* eslint-disable no-unused-vars */
var ajax = {
  delete(url, data, callback) {
    if(Object.prototype.toString.call(data) === '[object Function]') {
      callback = data;
      data = {};
    }
    $.request(url, data, {method: 'delete'}).then(rs => {
      var data;
      try {
        data = JSON.parse(rs.data);
      }catch(e) {
        data = rs.data;
      }
      callback(data);
    }).catch(err => {
      callback(error(err));
    });
  },
  get(url, data, callback) {
    if(Object.prototype.toString.call(data) === '[object Function]') {
      callback = data;
      data = {};
    }
    data.uid = auth.uid;
    data.token = auth.token;
    $.get(url, data).then(rs => {
      var data;
      try {
        data = JSON.parse(rs.data);
      }catch(e) {
        data = rs.data;
      }
      callback(data);
    }).catch(err => {
      callback(error(err));
    });
  },
  post(url, data, callback) {
    if(Object.prototype.toString.call(data) === '[object Function]') {
      callback = data;
      data = {};
    }
    var Data = new FormData();
    for(var n in data) {
      Data.append(n, data[n]);
    }
    Data.append('uid', auth.uid);
    Data.append('token', auth.token);
    $.post(url, Data).then(rs => {
      var data;
      try {
        data = JSON.parse(rs.data);
      }catch(e) {
        data = rs.data;
      }
      callback(data);
    }).catch(err => {
      callback(error(err));
    });
  },
  login(param, callback) {
    $.get('login', null, {
      headers: {
        'Authorization': 'Basic ' + btoa(unescape(encodeURIComponent(param.name + ':' + param.psw)))
      }
    }).then(rs => {
      var data;
      try {
        data = JSON.parse(rs.data);
      }catch(e) {
        data = rs.data;
      }
      if(data && data.login_id && data.token) {
        auth.setUser(data);
        data.status = true;
      }else {
        data.info = data.info || '用户信息异常';
      }
      callback(data);
    }).catch(err => {
      callback(error(err));
    });
  }
};

export default ajax;