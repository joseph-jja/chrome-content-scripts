(() => {
    "use strict";

    function t() {
        return Array.from(arguments).reduce((t, e) => +t + +e, 0)
    }

    function e(t, e) {
        return +t - +e
    }

    function o() {
        return Array.from(arguments).reduce((t, e) => +t * +e, 1)
    }

    function r(t, e) {
        return +t / +e
    }

    function n(t) {
        return t * Math.PI / 180
    }

    function s(t) {
        return 180 * t / Math.PI
    }
    const a = new class AstronomyMathUtilities {
            pad(t) {
                return `${t}`.padStart(2, "0")
            }
            raDegreesToHourMinutesSeconds(e) {
                const n = r(e < 0 ? t(e, 360) : e, 15),
                    s = Math.floor(n) % 24,
                    a = o(this.getFraction(n), 60);
                return {
                    hours: s,
                    minutes: Math.floor(a),
                    seconds: +Number(o(this.getFraction(a), 60)).toFixed(2)
                }
            }
            decDegreesToHourMinutesSeconds(t) {
                const e = t,
                    r = +`${e}`.split(".")[0] % 90,
                    n = o(this.getFraction(e), 60);
                return {
                    hours: r,
                    minutes: Math.floor(n),
                    seconds: +Number(o(this.getFraction(n), 60)).toFixed(2)
                }
            }
            hoursMinutesSeconds(t) {
                const r = Math.floor(t) % 360,
                    n = o(60, this.getFraction(t));
                let s = Math.floor(n),
                    a = Math.round(o(60, e(n, s)));
                return a >= 60 && (a = 0, s++), s >= 60 && (s = 0, r++), `${r}:${this.pad(s)}:${this.pad(a)}`
            }
            hoursMinutesSecondsTo24(r) {
                let n = Math.floor(r);
                n = n < 0 ? t(24, n) : n, n = n > 24 ? n % 24 : n;
                const s = o(60, this.getFraction(r));
                let a = Math.floor(s),
                    i = Math.round(o(60, e(s, a)));
                return i >= 60 && (i = 0, a++), a >= 60 && (a = 0, n++), n >= 24 && (n %= 24), `${n}:${this.pad(a)}:${this.pad(i)}`
            }
            degreeHHMMSSToDegrees(e, o, n) {
                return Number(t(e, r(o, 60), r(n, 3600))).toFixed(6)
            }
            mapTo24Hour(t) {
                let o = t;
                return o < 0 ? o = e(24, Math.abs(o)) % 24 : o >= 24 && (o %= 24), o
            }
            getFraction(o) {
                const r = e(Math.abs(o), Math.abs(Math.floor(o)));
                return r < 0 ? t(r, 1) : r
            }
        },
        i = Date.UTC(2e3, 0, 1, 12, 0, 0, 0),
        u = 2451545;
    const c = new class AstronomyDateUtilities {
        toUTC(t) {
            return {
                year: t.getUTCFullYear(),
                month: t.getUTCMonth(),
                date: t.getUTCDate(),
                hours: t.getUTCHours(),
                minutes: t.getUTCMinutes(),
                seconds: t.getUTCSeconds(),
                milliseconds: t.getUTCMilliseconds()
            }
        }
        toJulian(n) {
            const {
                year: s,
                month: a,
                date: i,
                hours: u,
                minutes: c,
                seconds: h
            } = n;
            let M = t(a, 1),
                d = s,
                l = t(u, r(c, 60), r(h, 3600));
            M <= 2 && (M = t(M, 12), d = e(d, 1));
            Math.floor(r(d, 100));
            const T = Math.floor(o(365.25, t(d, 4716))),
                m = Math.floor(o(30.6001, t(M, 1))),
                g = t(e(e(t(T, m, i), 13), 1524.5), r(l, 24));
            return Number(g).toFixed(6)
        }
        toJulianLT(o) {
            const n = r(e(o.getTime(), i), 864e5),
                s = t(u, n);
            return Number(s).toFixed(6)
        }
        toGMST(n) {
            const s = e(n, u),
                a = r(s, 36525),
                i = o(Math.pow(a, 2), 387933e-9),
                c = r(Math.pow(a, 3), 3871e4),
                h = e(t(280.46061837, o(s, 360.98564736629), i), c);
            return Number(h % 360).toFixed(6)
        }
        gmstToLST(e, o) {
            const r = o < 0 ? t(360, o) : o,
                n = t(e, r) % 360;
            return Number(n).toFixed(6)
        }
        lstDecimalToLstDecimalHours(t) {
            return r(t / 15)
        }
        isDST(t) {
            const e = new Date(t.getFullYear(), 0, 1).getTimezoneOffset(),
                o = new Date(t.getFullYear(), 6, 1).getTimezoneOffset();
            return Math.max(e, o) !== t.getTimezoneOffset()
        }
        utcToLST(t, e) {
            const o = this.toJulian(t),
                r = this.toGMST(o);
            return this.gmstToLST(r, e)
        }
        calculateLST(t, e) {
            const o = this.toUTC(t),
                r = this.utcToLST(o, e);
            return Number(r % 24).toFixed(6)
        }
    };
    window.AMU = a, window.ADU = c, window.altAzToRaDec = function(i, u, h, M, d) {
        const l = c.toUTC(d),
            T = c.toJulian(l),
            m = c.toGMST(T),
            g = c.gmstToLST(m, M),
            f = n(h),
            S = n(u),
            F = n(i),
            D = Math.sin(f),
            U = Math.cos(f),
            w = Math.sin(F),
            b = Math.cos(F),
            C = Math.cos(S),
            H = Math.sin(S),
            p = t(o(w, D), o(b, U, C)),
            x = Math.asin(p),
            L = Math.cos(x),
            N = s(x),
            $ = r(o(o(-1, H), b), L),
            A = r(e(w, o(p, D)), o(L, U)),
            y = e(g, s(Math.atan2($, A)));
        return {
            dec: N,
            decInHMS: a.decDegreesToHourMinutesSeconds(N),
            ra: y,
            raInHMS: a.raDegreesToHourMinutesSeconds(y)
        }
    }
})();
