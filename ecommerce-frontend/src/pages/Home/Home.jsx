import { CardItem, Destaque } from '../../components';
import { useProductCarousel } from '../../hooks';
import style from './Home.module.css'

export const HomePage = () => {
    const {produtos, produtoDestaque} = useProductCarousel();

    return (
        <div className={style.containerHome}>
            <div>
                {produtoDestaque && (
                    <Destaque key={produtoDestaque.id} produtoDestaque={produtoDestaque} />
                )}
            </div>
            <div>
                {produtos.map(produto => (
                    <CardItem key={produto.id} produto={produto} />
                ))}
            </div>
        </div>
    )
}