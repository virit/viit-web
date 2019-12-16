import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              name: '欢迎',
              icon: 'smile',
              path: '/welcome',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
            },
            {
              name: '系统设置',
              icon: 'smile',
              path: '/sys',
              routes: [
                {
                  name: '用户管理',
                  icon: 'user',
                  path: '/sys/user',
                  component: './sys/user',
                },
                {
                  name: '菜单管理',
                  icon: 'user',
                  path: '/sys/menu',
                  component: './sys/menu',
                },
                {
                  name: '角色类型',
                  icon: 'smile',
                  path: '/sys/role-type',
                  component: './sys/roleType',
                },
                {
                  name: '角色管理',
                  icon: 'smile',
                  path: '/sys/role',
                  component: './sys/role',
                },
                {
                  name: '数据字典',
                  icon: 'smile',
                  path: '/sys/dict',
                  component: './sys/dict',
                },
                {
                  name: '数据字典配置',
                  path: '/sys/dict/:id',
                  hideInMenu: true,
                  component: './sys/dictItem',
                },
                // {
                //   name: '角色管理',
                //   icon: 'smile',
                //   path: '/sys/role',
                //   component: './sys/role',
                // },
              ],
            },
            {
              name: '组织机构',
              icon: 'team',
              path: '/orga',
              routes: [
                {
                  name: '部门管理',
                  icon: 'apartment',
                  path: '/orga/department',
                  component: './orga/department',
                },
                {
                  name: '员工信息',
                  icon: 'user',
                  path: '/orga/staff',
                  component: './orga/staff',
                },
              ]
            },
            // {
            //   name: '个人设置',
            //   icon: 'smile',
            //   path: '/accountsettings',
            //   component: './AccountSettings',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
      pathRewrite: {
        '^/server': '',
      },
    },
  },
} as IConfig;
