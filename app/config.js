/*
mod : Config
cre : lwx 20180428
upd : lwx 20201026
ver : 1.1
*/

/* Note:
  *  _R: will be assign with angularjs register object from route.js
  *   v: versioning of the app, change this to clear cache
  * app: app path
  * res: res url
  * lOpt: Available language option
  * lDef: Default language
  * lDir: language file path
  * urlHome: route for home
  * urlAuth: login route
  * media: media path
  * appCode: application code for angular
  * appDependcies: angular application dependecies
  * _rD: default route
  * _r : routes configuration
  * 
*/
window._CFG = {
    v: "?v=1",
    app: "app/",
    res: "res/",
    lOpt: [{ i: "en", d: "English" }, { i: "id", d: "Indonesia" }],
    lDef: "en",
    lDir: "app/_/",
    urlHome: "/",
    urlAuth: "a/sign-in",
    media: "m/",
    Copyright: {
        ProductId: "pmi",
        Product: "pmi",
        Description: "lisoft pmi",
        Copyright: "lisoft 2020",
        Version: "1.0"
    },
    _R: "",
    // Set application name to Name
    appCode: "pmi",
    // Set application dependcies to Dependcies
    appDependcies: ["ngRoute", "uiCropper"],
    // set default route to _rD
    _rD: "/404",
    /*
    set routes list to _r
    URL safe chars:  ALPHA  DIGIT  "-" / "." / "_" / "~"
    Route format: ["RoutePath", { RouteSettingKey: RouteSettingValue, ... }]
    Where RouteSettingKey may be:
        c=controller
        u=url to html template
        t=html template string
        s=resolve/lazy loading of script(s)

    example to use s:
        ["/auth/login", {
            c: "cLogin",
            u: "a/login.htm",
            s: {
                a: "a/login.txt",       //encrypted js
                b: ["a/more.js", true]  //non encrypted js
            }
        }],
    */
    _r: [
        // ["/", {
        //     // u: "h/welcome.htm"
        //     redirectTo: "/dashboard"
        // }],
        ["/404", {
            u: "404.htm"
        }],
        ["/", {
            c: "cLanding",
            u: "landing/landing.html",
            s: {
                // a: "a/login.txt"
                b: ["landing/landing.js", true] 
            }
        }],
        // ["/events", {
        //     c: "cEvents",
        //     u: "events/events.html",
        //     s: {
        //         // a: "a/login.txt"
        //         b: ["events/events.js", true] 
        //     }
        // }],
        ["/sign-in", {
            c: "cSignIn",
            u: "auth/sign-in.html",
            s: {
                // a: "a/login.txt"
                b: ["auth/sign-in.js", true] 
            },
            p: "1"
        }],
        ["/sign-up", {
            c: "cSignUp",
            u: "auth/sign-up.html",
            s: {
                // a: "a/login.txt"
                b: ["auth/sign-up.js", true] 
            },
            p: "1"
        }],
        ["/central/dashboard", {
            c: "cDashboard",
            u: "dashboard/central/dashboard.html",
            s: {
                // a: "a/login.txt"
                b: ["dashboard/central/dashboard.js", true] 
            },
            p: "2"
        }],
        ["/province/dashboard", {
            c: "cDashboard",
            u: "dashboard/province/dashboard.html",
            s: {
                // a: "a/login.txt"
                b: ["dashboard/province/dashboard.js", true] 
            },
            p: "2"
        }],
        ["/district/dashboard", {
            c: "cDashboard",
            u: "dashboard/district/dashboard.html",
            s: {
                // a: "a/login.txt"
                b: ["dashboard/district/dashboard.js", true] 
            },
            p: "2"
        }],
        ["/subdistrict/dashboard", {
            c: "cDashboard",
            u: "dashboard/subdistrict/dashboard.html",
            s: {
                // a: "a/login.txt"
                b: ["dashboard/subdistrict/dashboard.js", true] 
            },
            p: "2"
        }],
        ["/member/dashboard", {
            c: "cDashboard",
            u: "dashboard/member/dashboard.html",
            s: {
                // a: "a/login.txt"
                b: ["dashboard/member/dashboard.js", true] 
            },
            p: "2"
        }],

        ["/events", {
            c: "cEvents",
            u: "events/events.html",
            s: {
                // a: "a/login.txt"
                b: ["events/events.js", true] 
            },
            p: "2"
        }],
        ["/donors", {
            c: "cDonors",
            u: "donors/donors.html",
            s: {
                // a: "a/login.txt"
                b: ["donors/donors.js", true] 
            },
            p: "2"
        }],
        ["/agency", {
            c: "cAgency",
            u: "agency/agency.html",
            s: {
                // a: "a/login.txt"
                b: ["agency/agency.js", true] 
            },
            p: "2"
        }],

        ["/master/province", {
            c: "cProvince",
            u: "master/province.html",
            s: {
                // a: "a/login.txt"
                b: ["master/province.js", true] 
            },
            p: "2"
        }],
        ["/master/district", {
            c: "cDistrict",
            u: "master/district.html",
            s: {
                // a: "a/login.txt"
                b: ["master/district.js", true] 
            },
            p: "2"
        }],
        ["/master/subdistrict", {
            c: "cSubdistrict",
            u: "master/subdistrict.html",
            s: {
                // a: "a/login.txt"
                b: ["master/subdistrict.js", true] 
            },
            p: "2"
        }],
        ["/events/request", {
            c: "cEventRequest",
            u: "events/request.html",
            s: {
                // a: "a/login.txt"
                b: ["events/request.js", true] 
            },
            p: "2"
        }],
        ["/events/request-list", {
            c: "cRequestList",
            u: "events/request-list.html",
            s: {
                // a: "a/login.txt"
                b: ["events/request-list.js", true] 
            },
            p: "2"
        }],
        ["/my-events", {
            c: "cMyEvents",
            u: "events/my-events.html",
            s: {
                // a: "a/login.txt"
                b: ["events/my-events.js", true] 
            },
            p: "2"
        }]
        /* ["/g/:id", {
            controller: "ctlG",
            templateUrl: "generic/g.htm"
        }], */
    ],
    /* Menu JSON design: array of object:
        t: type => 0: menu that has link, 1: menu group
        r: route
        i: icon
        d: description
        o: Group opened or closed (exist only when t=1) => 0: closed, 1: opened
        c: children => array of child menu
    */

        _m: [
            {
                a: "PMI Pusat",
                m: [
                    {
                        t: 0,
                        r: "/central/dashboard",
                        i: "bi-pie-chart",
                        d: "Dashboard",
                        c: []
                    },
                    {
                        t: 0,
                        r: "/events",
                        i: "bi-megaphone",
                        d: "Kegiatan",
                        c: [ ]
                    },
                    {
                        t: 0,
                        r: "/donors",
                        i: "bi-people",
                        d: "Pendonor",
                        c: []
                    },
                    {
                        t: 0,
                        r: "/agency",
                        i: "bi-building",
                        d: "Instansi",
                        c: []
                    },
                    {
                        t: 1,
                        r: "",
                        i: "bi-stack",
                        d: "Data Master",
                        c: [
                            {
                                t: 0,
                                r: "/master/province",
                                d: "Provinsi",
                                c: []
                            },
                            {
                                t: 0,
                                r: "/master/district",
                                d: "Kabupaten",
                                c: []
                            },
                            {
                                t: 0,
                                r: "/master/subdistrict",
                                d: "Kecamatan",
                                c: []
                            }
                        ]
                    }
                ]
            },

            {
                a: "PMI Provinsi",
                m: [
                    {
                        t: 0,
                        r: "province/dashboard",
                        i: "bi-pie-chart",
                        d: "Dashboard",
                        c: []
                    },
                    {
                        t: 1,
                        r: "/events",
                        i: "bi-megaphone",
                        d: "Kegiatan",
                        c: [ ]
                    },
                    {
                        t: 0,
                        r: "/donors",
                        i: "bi-people",
                        d: "Pendonor",
                        c: []
                    },
                    {
                        t: 0,
                        r: "/agency",
                        i: "bi-building",
                        d: "Instansi",
                        c: []
                    }
                ]
            },

            {
                a: "PMI Kabupaten",
                m: [
                    {
                        t: 0,
                        r: "district/dashboard",
                        i: "bi-pie-chart",
                        d: "Dashboard",
                        c: []
                    },
                    {
                        t: 1,
                        r: "/events",
                        i: "bi-megaphone",
                        d: "Kegiatan",
                        c: [ ]
                    },
                    {
                        t: 0,
                        r: "/donors",
                        i: "bi-people",
                        d: "Pendonor",
                        c: []
                    },
                    {
                        t: 0,
                        r: "/agency",
                        i: "bi-building",
                        d: "Instansi",
                        c: []
                    }
                ]
            },

            {
                a: "PMI Kecamatan",
                m: [
                    {
                        t: 0,
                        r: "subdistrict/dashboard",
                        i: "bi-pie-chart",
                        d: "Dashboard",
                        c: []
                    },
                    {
                        t: 1,
                        r: "",
                        i: "bi-megaphone",
                        d: "Kegiatan",
                        c: [
                            {
                                t: 0,
                                r: "/events/request-list",
                                d: "Permintaan",
                                c: []
                            },
                            {
                                t: 0,
                                r: "/events",
                                d: "Semua Kegiatan",
                                c: []
                            }
                        ]
                    },
                    {
                        t: 0,
                        r: "/donors",
                        i: "bi-people",
                        d: "Pendonor",
                        c: []
                    },
                    {
                        t: 0,
                        r: "/agency",
                        i: "bi-building",
                        d: "Instansi",
                        c: []
                    }
                ]
            },

            {
                a: "Member Darahku",
                m: [
                    {
                        t: 0,
                        r: "member/dashboard",
                        i: "bi-pie-chart",
                        d: "Dashboard",
                        c: []
                    },
                    {
                        t: 1,
                        r: "",
                        i: "bi-megaphone",
                        d: "Kegiatan",
                        c: [
                            {
                                t: 0,
                                r: "/events/request",
                                d: "Ajukan Kegiatan",
                                c: []
                            },
                            {
                                t: 0,
                                r: "/events",
                                d: "Semua Kegiatan",
                                c: []
                            },
                            {
                                t: 0,
                                r: "/my-events",
                                d: " Kegiatan Saya",
                                c: []
                            }
                        ]
                    },
                    {
                        t: 0,
                        r: "/donors",
                        i: "bi-people",
                        d: "Pendonor",
                        c: []
                    }
                ]
            },

        ]
        // _m: [
        //     {
        //         t: 0,
        //         r: "/dashboard",
        //         i: "grid",
        //         d: "Dashboard",
        //         s: 1,
        //         c: []
        //     },
        //     {
        //         t: 1,
        //         r: "",
        //         i: "accessibility",
        //         d: "General Info",
        //         s: 1,
        //         c: [
        //             {
        //                 t: 0,
        //                 r: "/general-info/personal",
        //                 d: "Personal",
        //                 s: 1,
        //                 c: []
        //             },
        //             {
        //                 t: 0,
        //                 r: "/general-info/employment",
        //                 d: "Employment",
        //                 s: 1,
        //                 c: []
        //             },
        //             {
        //                 t: 0,
        //                 r: "/general-info/education-&-experience",
        //                 d: "Education & Experience",
        //                 s: 1,
        //                 c: []
        //             }
        //         ]
        //     }
        // ],



    // _m: [
    //     {
    //         r: "/",
    //         g: "home",
    //         d: "Overview"
    //     },
    //     {
    //         g: "university",
    //         d: "Vaksin",
    //         o: true,
    //         c: [
    //             {
    //                 r: "/kuesioner",
    //                 g: "university",
    //                 d: "Questioner"
    //             },
    //             {
    //                 r: "/formulir",
    //                 g: "users",
    //                 d: "Formulir"
    //             },
    //         ]
    //     },
    //     {
    //         g: "university",
    //         d: "Message",
    //         o: true,
    //         c: [
    //             {
    //                 r: "/msg",
    //                 g: "university",
    //                 d: "Chat"
    //             }
    //         ]
    //     },
    //     {
    //         //r: "/usrmgt",
    //         g: "university",
    //         d: "Project",
    //         o: true,
    //         c: [
    //             {
    //                 r: "/project",
    //                 g: "university",
    //                 d: "Project"
    //             },
    //             {
    //                 r: "/a/role",
    //                 g: "users",
    //                 d: "Role"
    //             },
    //             {
    //                 r: "/a/user",
    //                 g: "user",
    //                 d: "User"
    //             },
    //             {
    //                 r: "/setting",
    //                 g: "cog",
    //                 d: "Settings"
    //             },
    //             {
    //                 r: "/d/e",
    //                 g: "book",
    //                 d: "Enum"
    //             },
    //         ]
    //     },
    //     {
    //         g: "cogs",
    //         d: "Tool",
    //         o: true,
    //         c: [
    //             {
    //                 r: "/tool/fa",
    //                 g: "th",
    //                 d: "Font Awesome icons"
    //             },
    //             {
    //                 r: "/tool/injectmenu",
    //                 g: "th",
    //                 d: "Inject Menu"
    //             },
    //             {
    //                 r: "/tool/note",
    //                 g: "book",
    //                 d: "Take notes"
    //             }
    //         ]
    //     },
    //     {
    //         g: "users",
    //         d: "Test",
    //         o: false,
    //         c: [
    //             {
    //                 g: "cog",
    //                 d: "test-1",
    //                 c: [
    //                     {
    //                         g: "cog",
    //                         d: "test-1.1",
    //                         c: [
    //                             {
    //                                 r: "/usrmgt/test/1.1.1",
    //                                 g: "cog",
    //                                 d: "test-1.1.1"
    //                             },
        
    //                         ]
    //                     },
    //                     {
    //                         r: "/usrmgt/test/1.2",
    //                         g: "cog",
    //                         d: "test-1.2"
    //                     },
    //                 ]
    //             },
    //             {
    //                 r: "/usrmgt/test/2",
    //                 g: "cog",
    //                 d: "test-2"
    //             },
    //         ]
    //     }
    // ],

};