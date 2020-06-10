import { removeFirstAndLastSlash, addPrefixSlash} from '../path';

describe('path: ', () => {
    it('removeFirstAndLastSlash',()=>{
        let str = removeFirstAndLastSlash('/a/b/c/')
        expect(str).toEqual('a/b/c')

        str = removeFirstAndLastSlash('a/b/c/')
        expect(str).toEqual('a/b/c')
    })

    it('addPrefixSlash',()=>{
        let str = addPrefixSlash('a/b/c/')
        expect(str).toEqual('/a/b/c/')

        str = addPrefixSlash('/a/b/c/')
        expect(str).toEqual('/a/b/c/')
    })

})