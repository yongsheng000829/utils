/**
 * 参数：[socketOpen|socketClose|socketMessage|socketError] = func，[socket连接成功时触发|连接关闭|发送消息|连接错误]
 * timeout：连接超时时间
 * @type {module.webSocket}
 */
import React, { Component } from "react";
import Validate from '../config/validate'
/*module.exports =  class webSocket*/
class webSocket extends Component {
    constructor(props) {
        super(props);
        this.param = props;
        this.reconnectCount = 0;
        this.socket = null;
        this.taskRemindInterval = null;
        this.isSucces = true;
    }
    connection = () => {
        let { socketUrl, timeout = 0 } = this.param;
        // 检测当前浏览器是什么浏览器来决定用什么socket
        if ('WebSocket' in window) {
            // console.log('WebSocket');
            this.socket = new WebSocket(socketUrl);
        }
        else if ('MozWebSocket' in window) {
            // console.log('MozWebSocket');
            this.socket = new WebSocket(socketUrl);
        } else {
            // console.log('SockJS');
            /*this.socket = new SockJS(socketUrl);*/
        }
        this.socket.onopen = this.onopen;
        this.socket.onmessage = this.onmessage;
        this.socket.onclose = this.onclose;
        this.socket.onerror = this.onerror;
        this.socket.sendMessage = this.sendMessage;
        this.socket.closeSocket = this.onclose;
        // 检测返回的状态码 如果socket.readyState不等于1则连接失败，关闭连接
        if (timeout) {
            let time = setTimeout(() => {
                if (this.socket && this.socket.readyState !== 1) {
                    this.socket.close();
                }
                clearInterval(time);
            }, timeout);
        }
    };
    // 连接成功触发
    onopen = () => {
        let { socketOpen } = this.param;
        this.isSucces = false  //连接成功将标识符改为false
        socketOpen && socketOpen();
    };
    // 后端向前端推得数据
    onmessage = (msg) => {
        let { socketMessage } = this.param;
        let status = this.socket.readyState;
        socketMessage && socketMessage(msg, status);
        // 打印出后端推得数据
        // console.log(msg);
    };
    // 关闭连接触发
    onclose = (e) => {
        this.isSucces = true   //关闭将标识符改为true
        console.log('关闭socket收到的数据');
        let { socketClose } = this.param;
        socketClose && socketClose(e);
        // 根据后端返回的状态码做操作
        // 我的项目是当前页面打开两个或者以上，就把当前以打开的socket关闭
        // 否则就20秒重连一次，直到重连成功为止
        if (e.code == '4500') {
            this.socket.close();
        }
        //  else {
        //     this.taskRemindInterval = setInterval(() => {
        //         if (this.isSucces) {
        //             this.connection();
        //         } else {
        //             clearInterval(this.taskRemindInterval)
        //         }
        //     }, 5000)
        // }
    };
    onerror = (e) => {
        // socket连接报错触发
        console.log(e)
        if (e.code == 1005) {
            this.socket.close();
        }
        let { socketError } = this.param;
        this.socket = null;
        socketError && socketError(e);
    };
    sendMessage = (value) => {
        // 向后端发送数据
        // console.log('this.socket---------------',this.socket)
        if (!Validate.isEmpty(this.socket) && !this.isSucces && this.socket.readyState == 1) {
            this.socket.send(value && JSON.stringify(value));
        }
    };
};
export default webSocket;