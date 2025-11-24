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
        u = 2451545,
        c = 365.25;
    const h = new class AstronomyDateUtilities {
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
                minutes: h,
                seconds: M
            } = n;
            let d = t(a, 1),
                l = s,
                T = t(u, r(h, 60), r(M, 3600));
            d <= 2 && (d = t(d, 12), l = e(l, 1));
            Math.floor(r(l, 100));
            const m = Math.floor(o(c, t(l, 4716))),
                g = Math.floor(o(30.6001, t(d, 1))),
                f = t(e(e(t(m, g, i), 13), 1524.5), r(T, 24));
            return Number(f).toFixed(12)
        }
        toJulianLT(o) {
            const n = r(e(o.getTime(), i), 864e5),
                s = t(u, n);
            return Number(s).toFixed(12)
        }
        toGMST(n) {
            const s = e(n, u),
                a = r(s, o(c, 100)),
                i = o(Math.pow(a, 2), 387933e-9),
                h = r(Math.pow(a, 3), 3871e4),
                M = e(t(280.46061837, o(s, 360.98564736629), i), h) % 360;
            return M < 0 ? Number(t(M, 360)).toFixed(12) : Number(M).toFixed(12)
        }
        gmstToLST(e, o) {
            const r = o < 0 ? t(360, o) : o,
                n = t(e, r) % 360;
            return Number(n).toFixed(12)
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
            return Number(r % 24).toFixed(12)
        }
    };
    window.AMU = a, window.ADU = h, window.altAzToRaDec = function(i, u, c, M, d) {
        const l = h.toUTC(d),
            T = h.toJulian(l),
            m = h.toGMST(T),
            g = h.gmstToLST(m, M),
            f = n(c),
            S = n(u),
            F = n(i),
            D = Math.sin(f),
            U = Math.cos(f),
            b = Math.sin(F),
            w = Math.cos(F),
            C = Math.cos(S),
            H = Math.sin(S),
            p = t(o(b, D), o(w, U, C)),
            x = Math.asin(p),
            N = Math.cos(x),
            L = s(x),
            $ = r(o(o(-1, H), w), N),
            A = r(e(b, o(p, D)), o(N, U)),
            y = e(g, s(Math.atan2($, A)));
        return {
            dec: L,
            decInHMS: a.decDegreesToHourMinutesSeconds(L),
            ra: y,
            raInHMS: a.raDegreesToHourMinutesSeconds(y)
        }
    }
})();
