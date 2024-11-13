import {atom} from "recoil";

export const userState = atom<{isLoading :boolean,username:string | null, name:string | null}>({
    key : 'userState',
    default : {
        isLoading : false,
        username: '',
        name: ''
    }
})