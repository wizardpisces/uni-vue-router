import { removeFirstAndLastSlash, addPrefixSlash, parsePath } from '../path';

describe('path: ', () => {
    it('removeFirstAndLastSlash', () => {
        let str = removeFirstAndLastSlash('/a/b/c/')
        expect(str).toEqual('a/b/c')

        str = removeFirstAndLastSlash('a/b/c/')
        expect(str).toEqual('a/b/c')
    })

    it('addPrefixSlash', () => {
        let str = addPrefixSlash('a/b/c/')
        expect(str).toEqual('/a/b/c/')

        str = addPrefixSlash('/a/b/c/')
        expect(str).toEqual('/a/b/c/')
    })

    describe('parsePath', () => {
        it('plain', () => {
            const res = parsePath('/a')
            expect(res.path).toBe('/a')
            expect(res.hash).toBe('')
            expect(res.query).toBe('')
        })

        it('query', () => {
            const res = parsePath('/a?foo=bar???')
            expect(res.path).toBe('/a')
            expect(res.hash).toBe('')
            expect(res.query).toBe('foo=bar???')
        })

        it('hash', () => {
            const res = parsePath('/a#haha#hoho')
            expect(res.path).toBe('/a')
            expect(res.hash).toBe('#haha#hoho')
            expect(res.query).toBe('')
        })

        it('both', () => {
            const res = parsePath('/a?foo=bar#ok?baz=qux')
            expect(res.path).toBe('/a')
            expect(res.hash).toBe('#ok?baz=qux')
            expect(res.query).toBe('foo=bar')
        })
    })

})