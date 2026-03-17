import { create } from 'zustand';


interface FormData {
    subjectName: string;
    from: number;
    to: number;
    date: string;
    time: string;
    subjectRangeLocked: boolean;
}

interface formStore {
    formData: Partial<FormData>,
    listData: any,
    updateForm: (name: string, value: any) => void,
    getList: any,
    updateList:any,
    getStatus:any
}

function useGetStatus() {
    const {list,obj} = useFormData((state) => (state.listData))
    let total = list?.length || 0;
    let present = 0;
    (list|| []).forEach((id:number) => {
        if(obj?.[id]?.present){
            present+=1
        }
    });
    let att = total > 0 ? Number((present/total)*100).toFixed(2) : '0.00'

    return {total,present,att};
}

function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
}

function getList(from: any, to: any) {
    const start = Number(from);
    const end = Number(to);

    if (!Number.isInteger(start) || !Number.isInteger(end) || start <= 0 || end < start) {
        return { obj: {}, list: [] };
    }

    let obj: any = {};
    let list = Array.from({ length: end - start + 1 }, (_, i) => {
        obj[i + start] = { id: i + start, present: false }
        return i + start
    });
    return { obj, list };
}

const useFormData = create<formStore>((set, get) => ({
    formData: {
        date: getTodayDate(),
        time: getCurrentTime(),
        subjectRangeLocked: false,
    },
    listData: { obj: {}, list: [] },
    updateForm: (name, value) => {
        set((state) => {
            const formData = { ...state.formData, [name]: value }
            const { from, to } = formData;
            const nextListData = getList(from, to)
            const hasExistingSelections = Array.isArray(state.listData?.list) && state.listData.list.length > 0;
            const shouldRebuildList = name === 'from' || name === 'to' || !hasExistingSelections;
            const listData = shouldRebuildList ? nextListData : state.listData;
            return {
                formData,
                listData
            }
        })
    },
    getList: () => {
        let { from, to } = get().formData;
        let { list, obj } = getList(from, to)
        return list
    },
    updateList: (id: number, isPresent: boolean) => {
        set((state) => {
            const obj = { ...state.listData.obj };
            obj[id] = {...obj[id], present:isPresent}; 
            return {
                listData: {
                    ...state.listData, obj
                }
            }
        })

    },
    getStatus:() => {
        let present = 0;
        const list = get().listData.list;
        const obj = get().listData.obj;
        for (let index = 0; index < list.length; index++) {
            if (obj?.[list[index]]?.present){
                present++;
            }
        }

        let att = list.length > 0 ? Number((present/list.length)*100) : 0

        return {present, total:list.length,att}
    }

}))

/**
 * list:[]
 * obj:{
 *  1:{},
 *  2:{}
 * }
    / */



export { useFormData, useGetStatus };
