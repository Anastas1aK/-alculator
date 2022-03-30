let buttons = document.querySelectorAll("div.button, div.button_speс");
let display_text = document.getElementById('display_text');

let calc_line = [];
let clear = false;
let last_part = "";


document.addEventListener("DOMContentLoaded", function() {

	if(localStorage.getItem('operations_list') == null)
    {
        let obj = {list: []};
        let json = JSON.stringify(obj);
        localStorage.setItem('operations_list', json);
    }
    else
    {
        load_from_localStorage();
    }
});


buttons.forEach(function(btn) {
    let new_part = "";
    let full_equation = "";
    btn.addEventListener('click', function() {
        if(clear == true)
        {
            display_text.innerHTML = "";
            clear = false;
        }
        if(btn.dataset.value == "C")
        {
            calc_line.length=0;
            full_equation = "";
            last_part = "";
            new_part = "";
            display_text.innerHTML = "";
        }
        else if(btn.dataset.value == "=")
        {   
            for(let i =0; i<calc_line.length; i++)
                full_equation+=calc_line[i];
            counting_values();

            full_equation+=" = ";
            full_equation+=calc_line[calc_line.length-1];

            save_in_localStorage(full_equation);
            load_from_localStorage();
            
            display_text.innerHTML = calc_line[0];
            full_equation = "";
            last_part = "";
            new_part = "";
            calc_line.pop();
            clear = true;
        }
        else
        {
            new_part = btn.dataset.value;

            if (new_part != ".")
            {
                if(last_part ==".")
                {
                    calc_line[calc_line.length-1]+=new_part;
                }
                else if ((new_part ==="0" ||new_part ==="1" ||new_part ==="2" ||new_part ==="3" ||
                        new_part ==="4" ||new_part ==="5" ||new_part ==="6" ||new_part ==="7" ||
                        new_part ==="8" || new_part ==="9") && (
                    last_part ==="0" ||last_part ==="1" ||last_part ==="2" ||last_part ==="3" ||
                    last_part ==="4" ||last_part ==="5" ||last_part ==="6" ||last_part ==="7" ||
                    last_part ==="8" || last_part ==="9"))
                {
                    calc_line[calc_line.length-1]+=new_part;
                }
                else if(new_part =="*" || new_part =="/" || new_part =="^" || new_part =="%" ||
                   new_part =="+" || new_part =="-" || new_part =="√")
                {
                    calc_line.push(btn.dataset.value);
                }
                else
                {
                    calc_line.push(btn.dataset.value);
                }
            }
            else
            {
                calc_line[calc_line.length-1]+=".";
            }

           last_part = new_part;
            display_text.innerHTML += new_part; 
        }
    });
});

function counting_values()
{
    let ind_to_move = 0;

    //Вычисление операций первого порядка
    for(let i=0; i<calc_line.length; i++)
    {
        //перенос значений на освободившиеся места
        calc_line[i-ind_to_move] =calc_line[i];

        if (calc_line[i] === "^")
        {
            calc_line[i-1-ind_to_move] = Math.pow(parseFloat(calc_line[i-1-ind_to_move]), parseFloat(calc_line[i+1]));
            ind_to_move += 2;
            i++;
        }
        else if(calc_line[i] === "%")
        {
            calc_line[i-1-ind_to_move] = parseFloat(calc_line[i-1-ind_to_move])/100;
            ind_to_move += 1;
        }else if(calc_line[i] === "√")
        {
            calc_line[i-ind_to_move] = Math.sqrt(parseFloat(calc_line[i+1]));
            i++;
            ind_to_move += 1;
        } 
    }
    while(ind_to_move >0)
    {
        calc_line.pop();
        ind_to_move--;
    }

    //Вычисление операций второго порядка
    for(let i=0; i<calc_line.length; i++)
    {
        calc_line[i-ind_to_move] =calc_line[i];
        
        if (calc_line[i] === "*")
        {
            calc_line[i-1-ind_to_move] = parseFloat(calc_line[i-1-ind_to_move])*parseFloat(calc_line[i+1]);
            ind_to_move += 2;
            i++;
        }
        else if(calc_line[i] === "/")
        {
            calc_line[i-1-ind_to_move] = parseFloat(calc_line[i-1-ind_to_move])/parseFloat(calc_line[i+1]);
            ind_to_move += 2;
            i++;
        }
    }
    while(ind_to_move >0)
    {
        calc_line.pop();
        ind_to_move--;
    }

    //Вычисление операций третьего порядка
    for(let i=0; i<calc_line.length; i++)
    {
        calc_line[i-ind_to_move] =calc_line[i];

        if (calc_line[i] === "+")
        {
            calc_line[i-1-ind_to_move] = parseFloat(calc_line[i-1-ind_to_move])+parseFloat(calc_line[i+1]);
            ind_to_move += 2;
            i++;
        }
        else if(calc_line[i] === "-")
        {
            calc_line[i-1-ind_to_move] = parseFloat(calc_line[i-1-ind_to_move])-parseFloat(calc_line[i+1]);
            ind_to_move += 2;
            i++;
        }
    }
    while(ind_to_move >0)
    {
        calc_line.pop();
        ind_to_move--;
    }
}

function save_in_localStorage(full_equation){
    let json = localStorage.getItem('operations_list');
    let list = JSON.parse(json);

    if(list.list.length<100)
    {
        list.list.push(full_equation);
    }
    else{
        for(let i=0; i<list.list.length-1; i++)
            list.list[i] = list.list[i+1];
        list.list[list.list.length-1] = full_equation;
    }

    json = JSON.stringify(list);
    localStorage.setItem('operations_list', json);
}

function load_from_localStorage(){
    let json = localStorage.getItem('operations_list');
    let list = JSON.parse(json);
    let  operations = document.querySelectorAll('div.operation');
    if(operations.length === list.list.length)
        i=operations.length-1;
    else
        i=operations.length;

    for(i; i<list.list.length; i++)
    {
        if(operations.length >= 100)
            operations[0].remove();

        let op_div = document.createElement('div');
        op_div.className = 'operation';
        op_div.innerHTML = list.list[i];
        document.querySelector('#operations').appendChild(op_div);
    }
}
