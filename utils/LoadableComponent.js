import React from 'react'
import Loadable from 'react-loadable'
import Loading from '../components/Loading'
import IsAbout from '../components/LoadActivity';

/**
 * 
 * @param {*} component 
 * @param {*} haveLoading  组件加载时是否有loading效果
 */
const LoadableComponent = (component, haveLoading = false, ) => {
    return Loadable({
        loader: () => component,
        loading: () => {
            if (haveLoading) {
                return <Loading style={{ background: 'none', height: 'calc(100vh - 173px)' }} />
            }
            return null
        }
    })
}

const LoadActivity = (component, haveLoading = false) => {
    return Loadable({
        loader: () => component,
        loading: () => {
            if (haveLoading) {
                return <IsAbout />
            }
            return null
        }
    })
}


export default LoadableComponent
export { LoadActivity };