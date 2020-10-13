import RouteMap from '../RouteMap'

describe('RouteMap: ', () => {
    let routeMap = new RouteMap({
        pagesJSON: {
            pages: [
                {
                    path: 'pages/a/' //without prefix slash
                },
                {
                    path: '/pages/a/b'
                },
                {
                    path: 'pages/a/b/c',
                    name: 'abcd' // with defined name
                }
            ],
            subPackages: [
                {
                    root: 'subPage',
                    pages: [
                        {
                            path: 'a',
                            name: 'subA'
                        },
                        {
                            path: '/a/b/'
                        },
                    ]
                }
            ]
        }
    })

    it('_routeTable', () => {
        // spyOn(console, 'error')
        expect(routeMap._routeTable).toStrictEqual([
            {
                path: '/pages/a',
                name: 'pages-a'
            },
            {
                path: '/pages/a/b',
                name: 'pages-a-b'
            },
            {
                path: '/pages/a/b/c',
                name: 'abcd'
            },
            {
                path: '/subPage/a',
                name: 'subA'
            },
            {
                path: '/subPage/a/b',
                name: 'subPage-a-b'
            },
        ])

        // expect(console.error).toHaveBeenCalledWith('[klk-uni-router] Please Provide pagesJSON!')
    })

    it('resolveNameByPath',()=>{
        expect(routeMap.resolveNameByPath('/pages/a/')).toEqual('pages-a')
        expect(routeMap.resolveNameByPath('/pages/a?query=1')).toEqual('pages-a')
    })

    it('resolvePathByName',()=>{
        expect(routeMap.resolvePathByName('abcd')).toEqual('/pages/a/b/c')
    })


})