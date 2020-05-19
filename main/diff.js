/**
 * 
 * @param {*} T1 
 * @param {*} T2 
 */
function diff(T1, T2) {
    let option = {
        delete: [],
        insert: [],
        replace: []
    }
    let T1_level = []
    let T2_level = []

    T1_level.push(T1)
    T2_level.push(T2)

    while (T1_level.length != 0 || T2_level.length != 0) {
        //对T1,T2同时层次遍历，然后同级进行diff差异比较
        T1_pnode = T1_level.pop()
        T2_pnode = T2_level.pop()
        //
        T1_children = T1_pnode.children ? T1_pnode.children : [];
        T2_children = T2_pnode.children ? T2_pnode.children : [];
        //同级Mapping算法
        let M_T1_to_T2 = new Map()
        let M_T2_to_T1 = new Map()
        for (let [i, T2node] of T2_children.entries()) {
            for (let [j, T1node] of T1_children.entries()) {
                let flag = false
                if (typeof T2node === 'string' || typeof T1node === 'string') {
                    if (T2node === T1node) flag = true;
                }
                else if (T2node.nodeName === T1node.nodeName) flag = true;
                if (flag) {
                    if (M_T2_to_T1.has(i)) break;
                    else if (M_T1_to_T2.has(j)) continue;
                    else {
                        //没有匹配则直接匹配
                        M_T2_to_T1.set(i, j)
                        M_T1_to_T2.set(j, i)
                        //id
                        typeof T2_children[i] === 'string' ? "" :
                            T2_children[i].attributes.id = T1_children[j].attributes.id;
                    }
                }
            }
        }
        /* 遍历Map，生成该级编辑脚本
         * 对于T1_children，未匹配的要做删除操作
         * 对于T2_children，未匹配的要做创建与插入操作
         * 对于已经匹配到的，但是节点属性不同的，要替换属性
         */
        for (let [index, item] of T1_children.entries()) {
            if (!M_T1_to_T2.has(index)) {
                // delete(item.attributes.id)//
                option.delete.push({
                    optName: 'delete',
                    type: item.attributes ? "ele" : 'text',
                    args: item.attributes ? [item.attributes.id] : [T1_pnode.attributes.id, index]
                })
            }
        }
        for (let [index, item] of T2_children.entries()) {
            if (M_T2_to_T1.has(index)) {
                T1node = item
                T2node = T2_children[M_T2_to_T1.get(index)]
                let flag = typeof T1node === 'string'
                if (!flag) {
                    let judge1 = T1node.attributes.length == T2node.attributes.length ? true : false;
                    let judge2 = true;
                    if (judge1) {
                        for (let key in T1node.attributes){
                            if (T1node.attributes[key] != T2node.attributes[key]) {
                                judge2 = false;
                                break;
                            }
                        }
                    }
                    if (judge1 && judge2) {
                        // replace(id,attr)
                        option.replace.push({
                            optName: 'replace',
                            type: 'attr',
                            // [id,oldNodeAttr,newNodeAttr]
                            args: [item.attributes.id,T1node.attributes,T2node.attributes]
                        })
                    }
                }
            } else {
                //先生成自己的id，然后再插入
                option.insert.push({
                    optName : 'insert',
                    type: item.attributes ? "ele" : 'text',
                    args: [T2_pnode.attributes.id, index, item] 
                })
                // index < T1_children.length ?
                //     console.log("insetBefore:" + (item.attributes ? item.attributes.id : item)) : console.log("appendChild:" + (item ? item.attributes.id : item));
                // insertBefore(newNode,id):appendChild();
            }
        }
        //确定下一次迭代入队节点,只有匹配节点可以进入下次迭代
        for (let [i, j] of M_T1_to_T2.entries()) {
            T1_level.push(T1_children[i])
            T2_level.push(T2_children[j])
        }
    }
    console.log(option)
}

T1 = {
    nodeName: 'article',
    attributes: {
        id: 1,
        class: 'md-article'
    },
    children: [
        {
            nodeName: 'p',
            attributes: {
                id: 2,
                class: 'md-p'
            },
            children: [
                '我是小神',
                {
                    nodeName: 'em',
                    attributes: {
                        id: 5,
                        class: 'md-em'
                    },
                    children: [
                        '我不是神'
                    ]
                }
            ]
        },
        {
            nodeName: 'hr',
            attributes: {
                id: 3,
                class: 'md-hr'
            },
            children: []
        },
        {
            nodeName: 'h1',
            attributes: {
                id: 4,
                class: 'md-h1'
            },
            children: []
        }
    ]
}
T2 = {
    nodeName: 'article',
    attributes: {
        id: 1,
        class: 'md-article'
    },
    children: [
        {
            nodeName: 'p',
            attributes: {
                id: 2,
                class: 'md-p'
            },
            children: [
                '我是神',
                {
                    nodeName: 'strong',
                    attributes: {
                        id: 5,
                        class: 'md-strong'
                    },
                    children: [
                        '我不是神'
                    ]
                }
            ]
        },
        {
            nodeName: 'p',
            attributes: {
                id: 3,
                class: 'md-p'
            },
            children: []
        },
        {
            nodeName: 'h1',
            attributes: {
                id: 4,
                class: 'md-h1'
            },
            children: []
        }
    ]
}
diff(T1, T2)