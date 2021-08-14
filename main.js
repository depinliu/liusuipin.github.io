/*
mod : loading css and script
cre : lwx 20180428
upd : lwx 20210108
ver : 3.5
*/

(function(f,E,h){let e,j,s=console.log,q=null,r=!0,b=h(),w="serviceWorker",c=0,d="",v="e",y="t",t="r",l="'`~#^VYZ",i="AEabcdefghijklmnopqrstuvwxyz(0){,.:;+-=}",n='`0fwfrfvf-fyEif,Ewpyyf:E!yfuESqs0w{e,svxC)-sCv:.fpEM-q)euvnf)E;vwrvy.eyv{flEa1fxEse-||yf{E1f;E2f+E3fnE4fmE8fzE16ftE32f=E45foE47fTE57fCE9ifLE95f(E1iifkE123fBE[]fME""f}Eg-d"0x{"f+d"an.+z0qa"f;d"Y"f:d"Lv-:0w{ "f.d" v, "f,d"y0wz"f{d"Yr)..q"f)d"q.mq/;rr"f0d"G=T"f(d["vwyv-:"f"vwusv{s.rr"f"vw.ssvs"]fzd"=ssvs "fyd"d "fxd"R.tp.rq "fwd" ,-0y.:"fvd"3iium"fud"Py.-r. n-0q eee"ftd"z.l,s-x.r rg1ii%g"fsd"qs-wr,vsxdsvq-q.j36i:.{hc"frd":0o"fqd"%"fpd").-:"fod[TfofCf;*tfLb;fkfLfLb{f=fo]fnd"+-;z{svpw:a;vyvsd"fmd"m"fld"l"AfHEw.n XMLHqquR.tp.rqfIE.E>.?.EEy?Herq-qprT.mqdHes.ruvwr.dHerq-qprfNEqV.e{.q\'BlI:jqhes.xvo.jhAfRE.E>.ey.w{q)fFEj.fqhE>.eupr)jqhfGEj.fqhE>.e;)-s}qjqhfPE.V`qfsfwfrEMfvE}eoc#0Eyf.ERjvhc0<.c0bE;h#qEv[0]fsEv[0b{]fwEq<s?{dlcq!EscqbEwhrbEujqhcZrAfSE.V`qEgAfsEj.fshV0,j!q[.]hgq[.]EgAc#`sEyf0ERj.hcs<0csbbhq[.][Gj.fsh]EsAZq[.][s]Af0Ej.fqfshV`0fwfrfvf-f)flfxE[]ftEnf=EnfoE+fTEMfCE[]fLEsjyhf(EqfkE{fBE.V#)E{c)!E-chvEL&(f(>>E{f(EEy&&j(EqfLEsjkbbhhfr|Ejv>y?{dyh*)f)<<E{Ac#0Eyc0<+c0bE{hx[0]E0c0,jrEyf-^;~rEEyh-^m~lEujrhc.yr. 0,jrEE{hrEyf-^z~lEujrhc.yr. 0,jrEE;hZMc#x[+]ElfwElfFjCflhc:chg0,jk>.hZMcrn0q;)jrEyf-^o~lErhg;-r. ydrEyf-^m~x[=bb]EujrhflE=a{ftaac+s.-zc;-r. {drEyf-^z~x[=bb]EujrhflE=a{ftaac+s.-zc;-r. ;dZCe(v0wjMhA0,jtEEy&&jt^ohfobbhfx[l]hTEx[l]c.yr.g0,jl!EE=hZ,cTEwbGjwfyhAFjCfThfx[=bb]EwbGjTfyhftaafwETftEEy&&jt^ohfobbhAAfwEqE>qEEM?,d0jRjqhftf0E>sj.fGjqf0hhhcZwAfWE.e{.q\'rBlT-{N-x.j}eph[y]fXEqE>.e;s.-q.T.mqNv:.jqhfDEjqfshV0,j!shZ.e;s.-q.\'jqhcse-uu.w:C)0y:jqhAfJEj.fqfshV`0fwc#w 0w 0Es?Dj.hd.fqh0er.q}qqs0+pq.jwfq[w]hc0,jshZDj0fshf0AfKE.Vqslgw.n Fpw;q0vwj.hjhA;-q;)j.hg)j.hAAfOESjPjhhfQEj.fqhVwEDj}e;hfq&&jwe0:E}elb}elhfDjXj.hfwhfDjwfWhAfUEyf$ERjqhf_EsV0,jU<$hgxEEy&&jre0ww.sHTMLE}e:bjUb{hb}e.b$hc`.Eq[U]fsEqE>.erq-sqrW0q)jqhc0,jUbE{f-Esj{h?{dsj;h?;dsj+h?+dyf-EEyhZJj}e,fgs.yd}e{f)s.,dsjyh?.erp+rqsj{hd.fqlu.d}e)AfWhfov0: _jhc.E.erp+rqsj{hfHevu.wj}e0f.hfHer.w:jhA.yr.g#0Eyf$ERjBhc0<$c0bbhKjB[0]hcBE,fNj}emhfNj}elhfxEE{&&j.e{.q\'BlI:j}elb}elhe:0r-+y.:E!ihAAcjjqf-hV#0Eyc0<+c0bbhH[q[0]]E-[0]cxEE{?jQj"@axvka"b}etb"axvka"b}esb"AA@"b}e+b}etb}e+b}esb"AA@"b}etb}e+b}esb}esb"AA"f}elb}elhfwEDj}e-hfwe0:E}elfJjwfgrs;dsepfYd"uvr0q0vwd-+rvypq.cqvud"bjseq||"5i%"hb"cy.,qd"bjsey||"5i%"hb"cn0:q)d"bjsen||"5ium"hb"c).0{)qd"bjse)||"5ium"hb"cx-s{0wd"bjsex||"a25um i i a25um"hb"can.+z0qa-w0x-q0vwdr "bjser||"4r"hb" y0w.-s 0w,0w0q.caxvka-w0x-q0vwdr "bjser||"4r"hb" y0w.-s 0w,0w0q.c-w0x-q0vwdr "bjser||"4r"hb" y0w.-s 0w,0w0q.c"AhfDjwf.e+v:lhhdjwEDj}erhfwe0:E}elfweYex-s{0wL.,qE}evfDjwf.e+v:lhfDjXj}euhfwhfrEJj}erfgAfwhfvEJj}erfgYd}enbjse+||"{s.l"hb"cn0:q)d"bjsen||"1ii%"hb"c).0{)qd"bjse)||"1ium"hAfwhfvEJj}erfgYd}enbjse;||"s.:"hb"cn0:q)d"bjsen||"1ii%"hb"c).0{)qd"bjse)||"1ium"hAfvhhf_jhAhj}e(f[.VIjh!E;*(?)j}ezbIjhb}eybIjyhhd-EE{?QjOjIj{hhhdFjBf-EE;?Ij{hdOjIj{hhhf_jhAf.VxEEy&&jveYen0:q)EjUa{bj.ey.w{q)Cvxupq-+y.?.eyv-:.:/.eqvq-yd{hh*(/$b}eqhAf.V)j}exbq[U]b}ewhA]h',a=["Element","let ","),B(),","for(","=u(c,","=>{","style","return "],o=f=>f.replace(/./g,f=>(j=d.indexOf(f),j<c?f:i[j])),x=f=>{for(j=i.length-1;j>=c;j--)d+=i[j];return o(f)},A=x(n),u=f=>{d=i=v=y=t=l=a=x=o=n=A=f},g=E=>{r&&(r=q,d=l,i=a,new Function(v,y,t,o(E))(f,b.f,b.a||{}),u(q))},p=f=>{f.installing||f.waiting||f.active},m=f=>{s("serviceWorker registration failed",f),g(A)};w in E?(e=E.serviceWorker,e.register(b.w,{scope:"/"}).then(p,m),e.ready.then(f=>{g(A)},m)):(s("Proceed without serviceWorker from navigator"),g(A))})
(document, navigator, ((resource)=>{
    //#region the part that need attention
    let
    // aplication version, change the number only to increase the application version
    // remember to change config.js cVer too
    _applicationVer = "?v=1",
    // service worker version, change the number only to increase the service worker version
    _serviceWorkerVer = "?v=1";

    return {
        /* Array of resources files to be loaded, type:
            0: default css as a link, can be ommitted
            1: css compressed
            2: js non compressed
            3: js compressed
            example: ['/linked.css', '0/anotherLinked.css', '1/compressed.css.txt', '2/nonCompressed.js', '3/app/compressed.js.txt']
        */
        f: [
            "1lib/w3/w3c.txt",
            "app/app.min.css",
            "lib/fa/css/font-awesome.min.css",
            "lib/animate/animate.min.css",
            "lib/ui-crop/ui-cropper.min.css",
            "lib/bsi/bootstrap-icons.min.css",
            "lib/bs/bs5.min.css",
            // "lib/am/angular-material.min.css",
            "2lib/bs/bs5.min.js",
            // "1app/hris.txt" + _applicationVer,
            "3lib/ng/ng.txt",
            "2lib/ui-crop/ui-cropper.min.js",
            "2app/config.js" + _applicationVer,
            // "2lib/am/angular-material.min.js",
            // "3app/lib.txt" + _applicationVer
            "2app/lib.js" + _applicationVer
        ],

        // set the service worker js file and the version
        w: './sw.min.js'+_serviceWorkerVer

        // animation setting
        , a: {
            a: 1 // animation type: 0 or 1
            /* //if t="0" then attribute below applicable
            , w: "100%" // width of progress bar animation. Default: 100%
            ,h: "10px" // height of progress bar animation. Default: 10px
            ,b: "grey" // background color of progress bar animation. Default: grey
            ,c: "red"  // color of progress bar animation. Default: red */

            //if t=1 then attribute below applicable
            , u: "m/spin/load2.png" // url of the spin image
            , t: "50%" // top position of the image
            , l: "50%" // left position of the image
            , w: "50px" // width of the image
            , h: "50px" // height of the image
            , m: "-25px 0 0 -25px" //margin: to position to middle of viewport, set to -half_w 0 0 -half_h
            , s: "4s" //animation speed
        }
    }
    //#endregion the part that need attention
}));