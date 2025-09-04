import React from 'react';
import style from './SizeSelector.module.css';

export const SizeSelector = ({ tamanhosDisponiveis, corSelecionada, onSelectTamanho, isTamanhoAvailableForSelectedCor, tamanhoSelecionado }) => {
    return (
        <div className={style.containerTamanho}>
            <h3>Tamanhos:</h3>
            <ul className={style.listaTamanhos}>
                {tamanhosDisponiveis.map((tamanho) => {
                    const isAvailable = isTamanhoAvailableForSelectedCor(tamanho, corSelecionada);
                    return (
                        <li
                            key={tamanho}
                            onClick={() => isAvailable && onSelectTamanho(tamanho)}
                            className={`${style.tamanhoItem} ${tamanhoSelecionado === tamanho ? style.tamanhoSelecionado : ''}`}
                            style={{
                                opacity: isAvailable ? 1 : 0.4,
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                            }}
                            title={isAvailable ? tamanho : `${tamanho} (Indisponível para a cor atual)`}
                        >
                            {tamanho}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};