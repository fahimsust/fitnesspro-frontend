import { renderSuspended,registerEndpoint } from '@nuxt/test-utils/runtime'
import { expect, test } from 'vitest'
import { screen } from '@testing-library/vue'
import Basic from "../../components/order/Basic.vue";
import order from "../../assets/json/test/order/order.json";

test('can render orders edit component', async () => {
    await renderSuspended(Basic,{props:{modelValue:order}})
    expect(screen.getByText('Downloadable #4')).toBeDefined();
    expect(screen.getAllByText('2897.00')).toBeDefined();
    expect(screen.getAllByText('2893.00')).toBeDefined();
    expect(screen.getAllByText('quam')).toBeDefined();
})