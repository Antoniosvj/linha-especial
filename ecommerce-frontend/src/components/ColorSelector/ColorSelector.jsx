// src/components/ColorSelector.jsx
import React from 'react';
import style from './ColorSelector.module.css'; // Usando o mesmo CSS para manter a consistência

export const ColorSelector = ({ coresDisponiveis, corHexMap, tamanhoSelecionado, onSelectCor, isCorAvailableForSelectedTamanho, corSelecionada }) => {
    return (
        <div className={style.containerCores}>
            <h3>Cores:</h3>
            <ul className={style.listaCores}>
                {coresDisponiveis.map((cor) => {
                    const isAvailable = isCorAvailableForSelectedTamanho(cor, tamanhoSelecionado);
                    return (
                        <li
                            key={cor}
                            onClick={() => isAvailable && onSelectCor(cor)}
                            className={`${style.corItem} ${corSelecionada === cor ? style.corSelecionada : ''}`}
                            style={{
                                backgroundColor: corHexMap[cor],
                                opacity: isAvailable ? 1 : 0.4,
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                            }}
                            title={isAvailable ? cor : `${cor} (Indisponível para o tamanho atual)`}
                        ></li>
                    );
                })}
            </ul>
        </div>
    );
};